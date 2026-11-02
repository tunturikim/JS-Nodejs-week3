import express from 'express';
import {
  getCats,
  getCatById,
  postCat,
  deleteCatById,
  putCatById,
} from '../controller/cat-controller.js';

const catRouter = express.Router();
// Bind the getCats function to the GET/POST request for the /cats route
catRouter.route('/').get(getCats).post(postCat);
// Bind the getCatById function to the GET request for the /cats/:id route
catRouter.route('/:id').get(getCatById).delete(deleteCatById).put(putCatById);

export default catRouter;
