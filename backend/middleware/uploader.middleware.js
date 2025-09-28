const multer = require('multer');
const path = require('path');
const { sanitizeObject } = require('../utils/sanitize');

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === 'text/html' || file.originalname.endsWith('.html')) {
      cb(null, path.join(__dirname, '../public/games/'));
    } else if (file.mimetype.startsWith('image/')) {
      cb(null, path.join(__dirname, '../public/img/'));
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/html' || file.originalname.endsWith('.html')) {
    cb(null, true);
  } else if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only HTML and image files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 10MB limit
  }
});

// Middleware function for handling file uploads
function uploaderMiddleware(req, res, next) {
  upload.fields([
    { name: 'gameFile', maxCount: 1 }, // HTML game file
    { name: 'imgFile', maxCount: 1 }   // Image file
  ])(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Check if files were uploaded
    if (!req.files || (Object.keys(req.files).length === 0)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    next();
  });
}

// Middleware for single file uploads (optional)
const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadMultiple = (fields) => upload.fields(fields);

module.exports = {
  uploaderMiddleware,
  upload,
  uploadSingle,
  uploadMultiple
};