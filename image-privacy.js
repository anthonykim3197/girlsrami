// Re-encode an admin-chosen photo so location, camera and Motion Photo data never leave the browser.
// Drawing to a canvas keeps only pixels; PNG stays PNG (transparency), everything else becomes JPEG.
export async function sanitizeImageFile(file, {maxEdge = 3000, quality = 0.9} = {}) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('JPG·PNG·WebP 사진만 올릴 수 있어요.');
  const bitmap = await createImageBitmap(file); // browsers apply EXIF rotation by default
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  if (type === 'image/jpeg') { context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('사진을 변환하지 못했어요. 다른 사진을 선택해 주세요.')), type, quality));
  return new File([blob], type === 'image/png' ? 'photo.png' : 'photo.jpg', {type});
}
