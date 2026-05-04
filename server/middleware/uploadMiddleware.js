// middleware/uploadMiddleware.js
// Uses multer memoryStorage so files are kept as Buffers in memory.
// The controller converts them to Base64 data URLs and saves directly in MongoDB.
// No temp files, no Cloudinary — nothing to clean up.

const multer = require('multer');
const path = require('path');

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB per file

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

module.exports = upload;