import express from 'express';
import {
  getUsers,
  getUserById,
  postUser,
  deleteUserById,
  putUserById,
} from '../controller/user-controller.js';

const userRouter = express.Router();
// Bind the getUsers function to the GET/POST request for the /users route
userRouter.route('/').get(getUsers).post(postUser);
// Bind the getUserById function to the GET request for the /users/:id route
userRouter
  .route('/:id')
  .get(getUserById)
  .delete(deleteUserById)
  .put(putUserById);

export default userRouter;
