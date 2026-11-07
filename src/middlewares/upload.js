import multer from 'multer';
import sharp from 'sharp';

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    const error = new Error('Only images and videos are allowed!');
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({
  dest: 'uploads/',
  limits: {fileSize: 10 * 1024 * 1024}, // 10 MB
  fileFilter,
});

const createThumbnail = async (req, res, next) => {
  // Thumbnails are only made for images
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    next();
    return;
  }
  try {
    console.log(req.file.path);
    // Thumbnail is saved next to the original with the _thumb suffix
    await sharp(req.file.path)
      .resize(160, 160)
      .png()
      .toFile(`${req.file.path}_thumb`);
    next();
  } catch (error) {
    next(error);
  }
};

export {upload, createThumbnail};
