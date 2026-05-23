const multer = require('multer');
const path = require('path');
const fs = require('fs');

// path uploaded files will be saved
const storagePath = path.join(__dirname, '../stored-documents');

// create the folder if it does not exist yet
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

// used diskStorage as files are saved to disk and stay there
// memoryStorage would lose the file after the request ends
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, storagePath),
  filename: (req, file, cb) => {
    // timestamp + random number so two users uploading same filename dont clash
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// only accept PDFs and images
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only PDF and images allowed'));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max per file
});