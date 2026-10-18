// QR Code model 2 encoder — byte mode, ECC level M, versions 1–10 (enough for
// page URLs; longer payloads return null so the UI can drop the code instead of
// rendering something unscannable). Pure + dependency-free.
//
// Layout follows ISO/IEC 18004: reed-solomon EC over GF(256), block
// interleaving, the eight masks with the standard penalty scoring, format and
// version information via their BCH(15,5)/BCH(18,6) codes.

// ECC level M tables, indexed by version − 1.
const EC_CODEWORDS_PER_BLOCK = [10, 16, 26, 18, 24, 16, 18, 22, 22, 26];
const EC_BLOCKS = [1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
const MAX_VERSION = 10;

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
{
  let value = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = value;
    GF_LOG[value] = i;
    value <<= 1;
    if (value & 0x100) value ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255] ?? 0;
}

const gfMultiply = (a: number, b: number): number =>
  a === 0 || b === 0 ? 0 : (GF_EXP[(GF_LOG[a] ?? 0) + (GF_LOG[b] ?? 0)] ?? 0);

const reedSolomonDivisor = (degree: number): number[] => {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = gfMultiply(result[j] ?? 0, root) ^ (result[j + 1] ?? 0);
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
};

const reedSolomonRemainder = (data: number[], divisor: number[]): number[] => {
  const result = new Array<number>(divisor.length).fill(0);
  for (const byte of data) {
    const factor = byte ^ (result.shift() ?? 0);
    result.push(0);
    divisor.forEach((coefficient, index) => {
      result[index] = (result[index] ?? 0) ^ gfMultiply(coefficient, factor);
    });
  }
  return result;
};

const rawDataModules = (version: number): number => {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const align = Math.floor(version / 7) + 2;
    result -= (25 * align - 10) * align - 55;
    if (version >= 7) result -= 36;
  }
  return result;
};

const dataCodewords = (version: number): number =>
  Math.floor(rawDataModules(version) / 8) - (EC_BLOCKS[version - 1] ?? 1) * (EC_CODEWORDS_PER_BLOCK[version - 1] ?? 0);

const pickVersion = (byteLength: number): number | null => {
  for (let version = 1; version <= MAX_VERSION; version++) {
    const lengthBits = version <= 9 ? 8 : 16;
    const capacityBits = dataCodewords(version) * 8;
    if (4 + lengthBits + byteLength * 8 <= capacityBits) return version;
  }
  return null;
};

const toCodewords = (bytes: Uint8Array, version: number): number[] => {
  const capacityBits = dataCodewords(version) * 8;
  const lengthBits = version <= 9 ? 8 : 16;
  const bits: number[] = [];
  const push = (value: number, length: number): void => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };

  push(0b0100, 4); // byte mode
  push(bytes.length, lengthBits);
  for (const byte of bytes) push(byte, 8);
  for (let i = 0; i < 4 && bits.length < capacityBits; i++) bits.push(0); // terminator
  while (bits.length % 8 !== 0) bits.push(0);
  for (let pad = 0xec; bits.length < capacityBits; pad ^= 0xec ^ 0x11) push(pad, 8);

  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] ?? 0);
    codewords.push(byte);
  }
  return codewords;
};

const addEccAndInterleave = (codewords: number[], version: number): number[] => {
  const blocks = EC_BLOCKS[version - 1] ?? 1;
  const eccLength = EC_CODEWORDS_PER_BLOCK[version - 1] ?? 0;
  const rawCodewords = Math.floor(rawDataModules(version) / 8);
  const shortLength = Math.floor(rawCodewords / blocks);
  const shortBlocks = blocks - (rawCodewords % blocks);
  const divisor = reedSolomonDivisor(eccLength);

  const dataBlocks: number[][] = [];
  const eccBlocks: number[][] = [];
  let offset = 0;
  for (let i = 0; i < blocks; i++) {
    const dataLength = shortLength - eccLength + (i < shortBlocks ? 0 : 1);
    const block = codewords.slice(offset, offset + dataLength);
    offset += dataLength;
    dataBlocks.push(block);
    eccBlocks.push(reedSolomonRemainder(block, divisor));
  }

  const result: number[] = [];
  for (let i = 0; i <= shortLength - eccLength; i++) {
    for (const block of dataBlocks) if (i < block.length) result.push(block[i] ?? 0);
  }
  for (let i = 0; i < eccLength; i++) {
    for (const block of eccBlocks) result.push(block[i] ?? 0);
  }
  return result;
};

interface MatrixState {
  modules: boolean[][];
  isFunction: boolean[][];
  size: number;
}

const setFunction = (state: MatrixState, x: number, y: number, dark: boolean): void => {
  const row = state.modules[y];
  const functionRow = state.isFunction[y];
  if (row && functionRow) {
    row[x] = dark;
    functionRow[x] = true;
  }
};

const buildMatrix = (version: number): MatrixState => {
  const size = version * 4 + 17;
  const state: MatrixState = {
    size,
    modules: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
    isFunction: Array.from({ length: size }, () => new Array<boolean>(size).fill(false)),
  };

  // Timing patterns (overwritten by finders/alignment where they cross).
  for (let i = 0; i < size; i++) {
    setFunction(state, 6, i, i % 2 === 0);
    setFunction(state, i, 6, i % 2 === 0);
  }

  const drawFinder = (x0: number, y0: number): void => {
    for (let dy = -1; dy <= 7; dy++) {
      for (let dx = -1; dx <= 7; dx++) {
        const x = x0 + dx;
        const y = y0 + dy;
        if (x < 0 || x >= size || y < 0 || y >= size) continue;
        const distance = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
        setFunction(state, x, y, distance !== 2 && distance !== 4);
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  if (version >= 2) {
    const alignCount = Math.floor(version / 7) + 2;
    const step = Math.floor((version * 4 + alignCount * 2 + 1) / (alignCount * 2 - 2)) * 2;
    const positions: number[] = [6];
    for (let pos = size - 7; positions.length < alignCount; pos -= step) positions.splice(1, 0, pos);
    for (const y of positions) {
      for (const x of positions) {
        // Skip the three finder corners.
        const nearFinder = (x === 6 && y === 6) || (x === 6 && y === size - 7) || (x === size - 7 && y === 6);
        if (nearFinder) continue;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            setFunction(state, x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
          }
        }
      }
    }
  }

  if (version >= 7) {
    const rem = ((): number => {
      let value = version;
      for (let i = 0; i < 12; i++) value = (value << 1) ^ ((value >>> 11) * 0x1f25);
      return value;
    })();
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const bit = ((bits >>> i) & 1) !== 0;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFunction(state, a, b, bit);
      setFunction(state, b, a, bit);
    }
  }

  drawFormatBits(state, 0); // reserves the format areas; rewritten with the chosen mask
  setFunction(state, 8, size - 8, true); // dark module

  return state;
};

const drawFormatBits = (state: MatrixState, mask: number): void => {
  const size = state.size;
  const data = mask; // ECC level M → format bits 00, so data = mask
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const bits = ((data << 10) | rem) ^ 0x5412;
  const bit = (i: number): boolean => ((bits >>> i) & 1) !== 0;

  for (let i = 0; i <= 5; i++) setFunction(state, 8, i, bit(i));
  setFunction(state, 8, 7, bit(6));
  setFunction(state, 8, 8, bit(7));
  setFunction(state, 7, 8, bit(8));
  for (let i = 9; i < 15; i++) setFunction(state, 14 - i, 8, bit(i));

  for (let i = 0; i < 8; i++) setFunction(state, size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) setFunction(state, 8, size - 15 + i, bit(i));
};

const drawCodewords = (state: MatrixState, codewords: number[]): void => {
  const size = state.size;
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        const functionRow = state.isFunction[y];
        const row = state.modules[y];
        if (functionRow?.[x] || !row) continue;
        const byte = codewords[bitIndex >>> 3] ?? 0;
        row[x] = ((byte >>> (7 - (bitIndex & 7))) & 1) !== 0;
        bitIndex++;
      }
    }
  }
};

const maskBit = (mask: number, x: number, y: number): boolean => {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0;
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default:
      return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
};

const applyMask = (state: MatrixState, mask: number): void => {
  for (let y = 0; y < state.size; y++) {
    for (let x = 0; x < state.size; x++) {
      const row = state.modules[y];
      const functionRow = state.isFunction[y];
      if (!row || !functionRow || functionRow[x]) continue;
      if (maskBit(mask, x, y)) row[x] = !row[x];
    }
  }
};

const penaltyScore = (state: MatrixState): number => {
  const size = state.size;
  const dark = (x: number, y: number): boolean => state.modules[y]?.[x] ?? false;
  let penalty = 0;

  // Rule 1: runs of five or more same-colour modules.
  for (let y = 0; y < size; y++) {
    let runColor = dark(0, y);
    let runLength = 1;
    for (let x = 1; x < size; x++) {
      if (dark(x, y) === runColor) {
        runLength++;
      } else {
        if (runLength >= 5) penalty += 3 + (runLength - 5);
        runColor = dark(x, y);
        runLength = 1;
      }
    }
    if (runLength >= 5) penalty += 3 + (runLength - 5);
  }
  for (let x = 0; x < size; x++) {
    let runColor = dark(x, 0);
    let runLength = 1;
    for (let y = 1; y < size; y++) {
      if (dark(x, y) === runColor) {
        runLength++;
      } else {
        if (runLength >= 5) penalty += 3 + (runLength - 5);
        runColor = dark(x, y);
        runLength = 1;
      }
    }
    if (runLength >= 5) penalty += 3 + (runLength - 5);
  }

  // Rule 2: 2×2 blocks of the same colour.
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const color = dark(x, y);
      if (color === dark(x + 1, y) && color === dark(x, y + 1) && color === dark(x + 1, y + 1)) penalty += 3;
    }
  }

  // Rule 3: finder-like 1:1:3:1:1 patterns with four light modules on a side.
  const patterns = ["10111010000", "00001011101"];
  const matches = (line: boolean[]): number => {
    const text = line.map((value) => (value ? "1" : "0")).join("");
    let count = 0;
    for (let i = 0; i + 11 <= text.length; i++) {
      const window = text.slice(i, i + 11);
      if (patterns.includes(window)) count++;
    }
    return count;
  };
  for (let y = 0; y < size; y++) {
    penalty += 40 * matches(Array.from({ length: size }, (_, x) => dark(x, y)));
  }
  for (let x = 0; x < size; x++) {
    penalty += 40 * matches(Array.from({ length: size }, (_, y) => dark(x, y)));
  }

  // Rule 4: deviation from a 50% dark ratio, in 5% steps.
  let darkCount = 0;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (dark(x, y)) darkCount++;
  const total = size * size;
  penalty += (Math.ceil(Math.abs(darkCount * 20 - total * 10) / total) - 1) * 10;

  return penalty;
};

/** Returns the module matrix (true = dark) or null when the text exceeds version 10. */
export const qrEncode = (text: string, options: { mask?: number } = {}): boolean[][] | null => {
  const bytes = new TextEncoder().encode(text);
  const version = pickVersion(bytes.length);
  if (version === null) return null;

  const state = buildMatrix(version);
  drawCodewords(state, addEccAndInterleave(toCodewords(bytes, version), version));

  let bestMask = options.mask ?? 0;
  if (options.mask === undefined) {
    let bestPenalty = Number.POSITIVE_INFINITY;
    for (let mask = 0; mask < 8; mask++) {
      applyMask(state, mask);
      drawFormatBits(state, mask);
      const penalty = penaltyScore(state);
      applyMask(state, mask); // undo
      if (penalty < bestPenalty) {
        bestPenalty = penalty;
        bestMask = mask;
      }
    }
  }
  applyMask(state, bestMask);
  drawFormatBits(state, bestMask);
  return state.modules;
};

/** Compact single-path SVG source for a QR matrix: runs of dark modules merge into one rect. */
export const qrSvgPath = (modules: boolean[][]): string => {
  let path = "";
  modules.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run]) run++;
      path += `M${x} ${y}h${run}v1h-${run}z`;
      x += run;
    }
  });
  return path;
};
