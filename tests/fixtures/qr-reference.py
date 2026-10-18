"""Dev-only QR reference matrices for tests/qr.test.ts (ECC level M).

The app ships a dependency-free QR encoder (src/utils/qr.ts); this fixture lets
the unit test compare it module-by-module against the well-known Python
`qrcode` package (forced versions and masks). The test skips itself when the
interpreter or the package is missing:

    py -3.13 -m pip install qrcode

Reads a JSON array of {text, version, mask} cases on stdin and prints a JSON
array of matrices (1 = dark), all with optimize=0 so the payload stays byte
mode — exactly what the app encoder emits.
"""

import json
import sys

import qrcode
from qrcode.constants import ERROR_CORRECT_M
from qrcode.util import MODE_8BIT_BYTE, QRData

cases = json.loads(sys.stdin.read())
matrices = []
for case in cases:
    code = qrcode.QRCode(
        version=case["version"], error_correction=ERROR_CORRECT_M, mask_pattern=case["mask"], border=0
    )
    code.add_data(QRData(case["text"], mode=MODE_8BIT_BYTE), optimize=0)
    code.make(fit=False)
    matrices.append([[1 if cell else 0 for cell in row] for row in code.get_matrix()])
print(json.dumps(matrices))
