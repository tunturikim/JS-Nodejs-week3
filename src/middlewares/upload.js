import sharp from 'sharp';

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
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

export {createThumbnail};
