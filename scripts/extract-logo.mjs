import { readFileSync, writeFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
// Extract only the approved spray-painted logo from the uploaded ZIP.
const zip = readFileSync(new URL('../public/DREAMSTATE (2).zip', import.meta.url));
let offset = 0;
let extracted = false;
while (offset + 30 <= zip.length) {
  if (zip.readUInt32LE(offset) !== 0x04034b50) break;
  const flags = zip.readUInt16LE(offset + 6);
  const method = zip.readUInt16LE(offset + 8);
  const size = zip.readUInt32LE(offset + 18);
  const nameLength = zip.readUInt16LE(offset + 26);
  const extraLength = zip.readUInt16LE(offset + 28);
  const name = zip.subarray(offset + 30, offset + 30 + nameLength).toString();
  const start = offset + 30 + nameLength + extraLength;
  if (flags & 8) throw new Error('ZIP data descriptors not supported for logo extraction');
  if (name === '16.png') {
    const bytes = zip.subarray(start, start + size);
    const png = method === 8 ? inflateRawSync(bytes) : method === 0 ? bytes : null;
    if (!png || png.subarray(1, 4).toString() !== 'PNG') throw new Error('Invalid logo PNG');
    writeFileSync(new URL('../public/dreamstate-spray-logo.png', import.meta.url), png);
    extracted = true;
    break;
  }
  offset = start + size;
}
if (!extracted) throw new Error('16.png not found in DREAMSTATE (2).zip');
