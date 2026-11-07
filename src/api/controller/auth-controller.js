 import jwt from 'jsonwebtoken';
 import bcrypt from 'bcrypt';
 import {findUserByUsername} from '../model/user-model.js';
 import 'dotenv/config';

 const postLogin = async (req, res, next) => {
   const user = await findUserByUsername(req.body.username);
   if (!user) {
     const error = new Error('Invalid username or password');
     error.status = 401;
     return next(error);
   }

   const passwordMatch = await bcrypt.compare(req.body.password, user.password);
   if (!passwordMatch) {
     const error = new Error('Invalid username or password');
     error.status = 401;
     return next(error);
   }

   const userWithNoPassword = {
     user_id: user.user_id,
     name: user.name,
     username: user.username,
     email: user.email,
     role: user.role,
   };

   const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
     expiresIn: '24h', // token expiration time, e.g. 24 hours, can be configured in .env too
   });
   res.json({user: userWithNoPassword, token});
 };

 const getMe = (req, res, next) => {
  if (res.locals.user) {
    res.json({message: 'token ok', user: res.locals.user});
  } else {
    const error = new Error('Unauthorized');
    error.status = 401;
    next(error);
  }
};

export {postLogin, getMe};