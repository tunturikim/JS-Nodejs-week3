import express from 'express';
import {
  getUsers,
  getUserById,
  postUser,
  deleteUserById,
  putUserById,
} from '../controller/user-controller.js';

import {authenticateToken} from '../../middlewares/authentication.js';

import {body, param} from 'express-validator';
import {validationErrors} from '../../middlewares/error-handlers.js';

const userRules = (optional) => {
  const field = (name) => {
    const chain = body(name);
    return optional ? chain.optional() : chain;
  };
  return [
    field('name').trim().isLength({min: 1, max: 100}).withMessage('required, max 100 characters').escape(),
    field('username')
      .trim()
      .isLength({min: 3, max: 20})
      .withMessage('must be 3-20 characters')
      .isAlphanumeric()
      .withMessage('must contain only letters and numbers'),
    field('email').trim().isEmail().withMessage('must be a valid email').normalizeEmail(),
    field('password').trim().isLength({min: 8}).withMessage('must be at least 8 characters'),
    body('role').optional().isIn(['user', 'admin']).withMessage("must be 'user' or 'admin'"),
  ];
};

const userRouter = express.Router();
// Bind the getUsers function to the GET/POST request for the /users route
userRouter.route('/').get(getUsers).post(userRules(false), validationErrors, postUser);
// Bind the getUserById function to the GET request for the /users/:id route
userRouter
  .route('/:id')
  .all(param('id').isInt({min: 1}).withMessage('must be a positive integer'), validationErrors)
  .get(getUserById)
  .delete(authenticateToken, deleteUserById)
  .put(authenticateToken, userRules(true), validationErrors, putUserById);

export default userRouter;
