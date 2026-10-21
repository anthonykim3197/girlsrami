// Finds data in an image file that must never be published: GPS, camera identity,
// Motion Photo / embedded video, or any bytes hidden after the image ends.
const u16 = (b, o, le) => le ? b.readUInt16LE(o) : b.readUInt16BE(o);
const u32 = (b, o, le) => le ? b.readUInt32LE(o) : b.readUInt32BE(o);

function tiffReasons(t) {
  const reasons = [];
  if (t.length < 8 || !['II', 'MM'].includes(t.toString('latin1', 0, 2))) return reasons;
  const le = t[0] === 0x49, ifd = u32(t, 4, le);
  if (ifd + 2 > t.length) return reasons;
  for (let i = 0, n = u16(t, ifd, le); i < n && ifd + 14 + i * 12 <= t.length; i++) {
    const tag = u16(t, ifd + 2 + i * 12, le);
    if (tag === 0x8825) reasons.push('gps');
    if (tag === 0x010f || tag === 0x0110) reasons.push('camera');
  }
  return reasons;
}

function xmpReasons(text) {
  const reasons = [];
  if (/exif:GPS|GPSLatitude|GPSLongitude/i.test(text)) reasons.push('gps');
  if (/MotionPhoto|MicroVideo|Container:Directory/i.test(text)) reasons.push('motion-photo');
  return reasons;
}

function jpegReasons(b) {
  const reasons = [];
  let p = 2;
  while (p + 1 < b.length) {
    if (b[p] !== 0xff) { p++; continue; }
    const marker = b[p + 1];
    if (marker === 0xd9) { if (b.length > p + 2) reasons.push('data-after-image'); return reasons; }
    if (marker === 0xff || marker === 0x00 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { p += 2; continue; }
    if (p + 4 > b.length) break;
    const length = b.readUInt16BE(p + 2), body = b.subarray(p + 4, p + 2 + length);
    if (marker === 0xe1 && body.toString('latin1', 0, 6) === 'Exif\0\0') reasons.push(...tiffReasons(body.subarray(6)));
    if (marker === 0xe1 && body.toString('latin1', 0, 28) === 'http://ns.adobe.com/xap/1.0/') reasons.push(...xmpReasons(body.toString('latin1')));
    p += 2 + length;
    if (marker === 0xda) while (p + 1 < b.length && !(b[p] === 0xff && b[p + 1] !== 0x00 && !(b[p + 1] >= 0xd0 && b[p + 1] <= 0xd7))) p++;
  }
  reasons.push('unterminated-jpeg');
  return reasons;
}

function pngReasons(b) {
  const reasons = [];
  for (let p = 8; p + 12 <= b.length;) {
    const length = b.readUInt32BE(p), type = b.toString('latin1', p + 4, p + 8), data = b.subarray(p + 8, p + 8 + length);
    if (type === 'eXIf') reasons.push(...tiffReasons(data));
    if (type === 'iTXt' || type === 'tEXt' || type === 'zTXt') reasons.push(...xmpReasons(data.toString('latin1')));
    p += 12 + length;
    if (type === 'IEND') { if (p < b.length) reasons.push('data-after-image'); return reasons; }
  }
  reasons.push('unterminated-png');
  return reasons;
}

function webpReasons(b) {
  const reasons = [];
  for (let p = 12; p + 8 <= b.length;) {
    const type = b.toString('latin1', p, p + 4), length = b.readUInt32LE(p + 4), data = b.subarray(p + 8, p + 8 + length);
    if (type === 'EXIF') reasons.push(...tiffReasons(data.toString('latin1', 0, 6) === 'Exif\0\0' ? data.subarray(6) : data));
    if (type === 'XMP ') reasons.push(...xmpReasons(data.toString('latin1')));
    p += 8 + length + (length & 1);
  }
  if (b.readUInt32LE(4) + 8 < b.length) reasons.push('data-after-image');
  return reasons;
}

export function privatePhotoData(bytes) {
  const b = Buffer.from(bytes);
  let reasons = [];
  if (b[0] === 0xff && b[1] === 0xd8) reasons = jpegReasons(b);
  else if (b.toString('hex', 0, 8) === '89504e470d0a1a0a') reasons = pngReasons(b);
  else if (b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') reasons = webpReasons(b);
  return [...new Set(reasons)];
}

// CLI: node scripts/photo-privacy.mjs <folder>  -> exits 1 and lists files that must not be published.
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const flagged = [];
  const walk = dir => { for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { if (!['node_modules', '.git'].includes(entry.name)) walk(path); }
    else if (/\.(?:jpe?g|png|webp)$/i.test(entry.name)) { const reasons = privatePhotoData(readFileSync(path)); if (reasons.length) flagged.push(`${path}: ${reasons.join(', ')}`); }
  } };
  walk(process.argv[2] || '.');
  if (flagged.length) { console.error(`Private photo data found in ${flagged.length} file(s):\n${flagged.join('\n')}`); process.exit(1); }
  console.log('No location, camera or hidden video data found.');
}
