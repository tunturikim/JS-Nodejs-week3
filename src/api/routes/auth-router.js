import express from 'express';
import {
  postLogin,
} from '../controller/auth-controller.js';

const authRouter = express.Router();
// Bind the postLogin function to the POST request for the /login route
authRouter.route('/login').post(postLogin);

export default authRouter;