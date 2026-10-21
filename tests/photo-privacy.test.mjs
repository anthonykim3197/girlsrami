import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {privatePhotoData} from '../scripts/photo-privacy.mjs';

const root = new URL('../', import.meta.url);
const skip = new Set(['.git', 'node_modules', 'dist']);
function images(relative = '') {
  return readdirSync(new URL(relative || '.', root), {withFileTypes: true}).flatMap(entry => {
    const path = relative + entry.name;
    if (entry.isDirectory()) return skip.has(entry.name) ? [] : images(path + '/');
    return /\.(?:jpe?g|png|webp)$/i.test(entry.name) ? [path] : [];
  });
}

test('no published image carries location, camera identity or hidden Motion Photo video', () => {
  const flagged = images().map(path => [path, privatePhotoData(readFileSync(new URL(path, root)))]).filter(([, reasons]) => reasons.length);
  assert.deepEqual(flagged, []);
});

test('the detector recognizes GPS, camera, Motion Photo and data after the image end', () => {
  const tiff = tags => {
    const b = Buffer.alloc(14 + tags.length * 12);
    b.write('MM\0*\0\0\0\x08', 0, 'latin1'); b.writeUInt16BE(tags.length, 8);
    tags.forEach((tag, i) => b.writeUInt16BE(tag, 10 + i * 12));
    return b;
  };
  const app1 = body => { const h = Buffer.from([0xff, 0xe1, 0, 0]); h.writeUInt16BE(body.length + 2, 2); return Buffer.concat([h, body]); };
  const jpeg = (...parts) => Buffer.concat([Buffer.from([0xff, 0xd8]), ...parts, Buffer.from([0xff, 0xd9])]);
  const exif = tags => app1(Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), tiff(tags)]));
  assert.deepEqual(privatePhotoData(jpeg()), []);
  assert.deepEqual(privatePhotoData(jpeg(exif([0x0112]))), [], 'orientation alone is allowed');
  assert.deepEqual(privatePhotoData(jpeg(exif([0x8825]))), ['gps']);
  assert.deepEqual(privatePhotoData(jpeg(exif([0x010f, 0x0110]))), ['camera']);
  assert.deepEqual(privatePhotoData(jpeg(app1(Buffer.from('http://ns.adobe.com/xap/1.0/\0<x GCamera:MotionPhoto="1"/>', 'latin1')))), ['motion-photo']);
  assert.deepEqual(privatePhotoData(Buffer.concat([jpeg(), Buffer.from('\0\0\0\x18ftypmp42', 'latin1')])), ['data-after-image']);
});

test('admin uploads are re-encoded before they reach Supabase Storage', () => {
  const editor = readFileSync(new URL('admin-product-editor.js', root), 'utf8');
  assert.match(editor, /import \{sanitizeImageFile\} from '\.\/image-privacy\.js'/);
  assert.match(editor, /const file = await sanitizeImageFile\(original\)/);
  assert.match(readFileSync(new URL('member.js', root), 'utf8'), /e=await\(await import\('\.\/image-privacy\.js'\)\)\.sanitizeImageFile\(e\);let r=t\+"\/"/);
});
