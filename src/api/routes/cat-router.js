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

// Multer and sharp import
import multer from 'multer';
import {createThumbnail} from '../../middlewares/upload.js';
const upload = multer({dest: 'uploads/'});

const catRouter = express.Router();
// Bind the getCats function to the GET/POST request for the /cats route
catRouter
  .route('/')
  .get(logger, getCats)
  .post(authenticateToken, upload.single('image'), createThumbnail, postCat);
// Bind the getCatById function to the GET request for the /cats/:id route
catRouter.route('/:id').get(getCatById).delete(deleteCatById).put(putCatById);

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
