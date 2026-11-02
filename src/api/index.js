import express from 'express';
import catRouter from './routes/cat-router.js';

const router = express.Router();

// bind base url for all cat routes to catRouter
router.use('/cats', catRouter);
// TODO: Add userRouter and bind it to /users route
// router.use('/users', userRouter);
export default router;
