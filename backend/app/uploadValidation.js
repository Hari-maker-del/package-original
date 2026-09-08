function hasJpegSignature(buffer) {
  return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}
function hasPngSignature(buffer) {
  return buffer.length >= 8 && Buffer.from([137,80,78,71,13,10,26,10]).equals(buffer.subarray(0,8));
}
function hasWebpSignature(buffer) {
  return buffer.length >= 12 && buffer.subarray(0,4).toString("ascii") === "RIFF" && buffer.subarray(8,12).toString("ascii") === "WEBP";
}
function validateImageBuffer(file) {
  if (!file?.buffer?.length) return { ok: false, message: "Image is empty." };
  const type = String(file.mimetype || "").toLowerCase();
  const valid = (type === "image/jpeg" && hasJpegSignature(file.buffer)) ||
    (type === "image/png" && hasPngSignature(file.buffer)) ||
    (type === "image/webp" && hasWebpSignature(file.buffer));
  return valid ? { ok: true } : { ok: false, message: "The uploaded file is not a valid JPEG, PNG, or WEBP image." };
}
module.exports = { validateImageBuffer };
