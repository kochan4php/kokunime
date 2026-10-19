// Optional at-rest encryption for exported backups: PBKDF2-SHA256 (310k
// iterations) derives an AES-GCM-256 key; the JSON envelope is portable and
// self-describing. Passphrases never leave the device.
const FORMAT = "kokunime-encrypted-backup";
const ITERATIONS = 310_000;

interface EncryptedEnvelope {
  format: typeof FORMAT;
  version: 1;
  kdf: "PBKDF2-SHA256";
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
}

const toBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

const fromBase64 = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return bytes;
};

// WebCrypto's BufferSource rejects SharedArrayBuffer-backed views under the
// current lib types; copy into a private ArrayBuffer before every call.
const bufferOf = (bytes: Uint8Array): ArrayBuffer => {
  const copy = new Uint8Array(bytes.length);
  copy.set(bytes);
  return copy.buffer as ArrayBuffer;
};

const deriveKey = async (passphrase: string, salt: Uint8Array, usage: KeyUsage[]): Promise<CryptoKey> => {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: bufferOf(salt), iterations: ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    usage,
  );
};

export const encryptBackup = async (plain: string, passphrase: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt, ["encrypt"]);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: bufferOf(iv) }, key, new TextEncoder().encode(plain)),
  );
  const envelope: EncryptedEnvelope = {
    format: FORMAT,
    version: 1,
    kdf: "PBKDF2-SHA256",
    iterations: ITERATIONS,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext),
  };
  return JSON.stringify(envelope, null, 2);
};

export const decryptBackup = async (text: string, passphrase: string): Promise<string> => {
  const envelope = JSON.parse(text) as Partial<EncryptedEnvelope>;
  if (envelope.format !== FORMAT || typeof envelope.salt !== "string" || typeof envelope.iv !== "string") {
    throw new Error("format");
  }
  if (typeof envelope.ciphertext !== "string") throw new Error("format");
  const salt = fromBase64(envelope.salt);
  const iv = fromBase64(envelope.iv);
  const key = await deriveKey(passphrase, salt, ["decrypt"]);
  try {
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: bufferOf(iv) },
      key,
      bufferOf(fromBase64(envelope.ciphertext)),
    );
    return new TextDecoder().decode(plain);
  } catch {
    throw new Error("passphrase");
  }
};
