import express from 'express';
import {
  getCats,
  getCatById,
  postCat,
  deleteCatById,
  putCatById,
} from '../controller/cat-controller.js';
import logger from '../../middlewares/logger.js';
import {authenticateToken} from '../../middlewares/authentication.js';

import {body, param} from 'express-validator';
import {upload, createThumbnail} from '../../middlewares/upload.js';
import {validationErrors} from '../../middlewares/error-handlers.js';

// Validation rules. Owner is taken from the token, so it is not validated here.
const catRules = (optional) => {
  const field = (name) => {
    const chain = body(name);
    return optional ? chain.optional() : chain;
  };
  return [
    field('cat_name')
      .trim()
      .isLength({min: 3, max: 50})
      .withMessage('must be 3-50 characters')
      .escape(),
    field('weight').isFloat({min: 0.1, max: 100}).withMessage('must be a number 0.1-100'),
    field('birthdate')
      .isISO8601({strict: true})
      .withMessage('must be a valid date (YYYY-MM-DD)'),
  ];
};

const catRouter = express.Router();
// Bind the getCats function to the GET/POST request for the /cats route
catRouter
  .route('/')
  .get(logger, getCats)
  .post(
    authenticateToken,
    upload.single('image'),
    catRules(false),
    validationErrors,
    createThumbnail,
    postCat,
  );
// Bind the getCatById function to the GET request for the /cats/:id route
catRouter
  .route('/:id')
  .all(param('id').isInt({min: 1}).withMessage('must be a positive integer'), validationErrors)
  .get(getCatById)
  .delete(authenticateToken, deleteCatById)
  .put(authenticateToken, catRules(true), validationErrors, putCatById);

export default catRouter;

// Multer on yksi tällainen middleware, joka osaa lukea multipart/form-data -pyynnöt ja tallentaa tiedostot serverille

// Myöhemmin lisätään esim. autentikointi, virheenkäsittely.

// upload.single('file'):
// tallentaa tiedoston esim. uploads/-kansioon ja
// lisää req.file-olion, jossa on esim.:

// {
//   fieldname: 'file',           // formin "name"
//   originalname: 'image.jpg',   // alkuperäinen nimi
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'uploads/',     // mihin tallennettiin
//   filename: 'a8f9234bd12.jpg', // generoitu nimi levyllä
//   path: 'uploads/a8f9234bd12.jpg',
//   size: 12345
// }

// Kaikki muut kentät (cat_name, weight, …) menevät  req.body-olioon.
