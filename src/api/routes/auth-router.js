import express from 'express';
import {postLogin, getMe} from '../controller/auth-controller.js';
import {authenticateToken} from '../../middlewares/authentication.js';

const authRouter = express.Router();
// Bind the postLogin function to the POST request for the /login route
authRouter.route('/login').post(postLogin);
// Returns the user info from the token (requires a valid token)
authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;