import {
  listAllUsers,
  findUserById,
  findUserByUsername,
  addUser,
  removeUserById,
  modifyUserById,
} from '../model/user-model.js';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
   // This is an API endpoint that returns a list of users
  console.log('Ollaan controllerissa');
  const users = await listAllUsers();
  //res.json(listAllUsers());
  res.json({
    requestTime: req.requestTime,
    time: req.requestTime,
    users: users,
  });
};

export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  const user = await findUserById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    const error = new Error('User not found');
    error.status = 404;
    next(error);
  }
};

export const getUserByUsername = async (req, res, next) => {
  const username = req.params.username;
  const user = await findUserByUsername(username);
  if (user) {
    res.status(200).json(user);
  } else {
    const error = new Error('User not found');
    error.status = 404;
    next(error);
  }
};

export const postUser = async (req, res, next) => {
  // Hash the password before storing it
  req.body.password = bcrypt.hashSync(req.body.password, 10); 
  console.log('request body', req.body);
  const result = await addUser(req.body);
  if (result) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    const error = new Error('Could not add user');
    error.status = 400;
    next(error);
  }
};

// Admin or the user themselves may modify/delete the user
const canModifyUser = (req, res) => {
  const {user_id, role} = res.locals.user;
  return role === 'admin' || user_id === Number(req.params.id);
};

export const deleteUserById = async (req, res, next) => {
  if (!canModifyUser(req, res)) {
    const error = new Error('Forbidden');
    error.status = 403;
    return next(error);
  }
  const result = await removeUserById(req.params.id);
  if (result) {
    res.status(200).json({message: 'User deleted successfully'});
  } else {
    const error = new Error('User not found');
    error.status = 404;
    next(error);
  }
};

export const putUserById = async (req, res, next) => {
  if (!canModifyUser(req, res)) {
    const error = new Error('Forbidden');
    error.status = 403;
    return next(error);
  }
  // Only admin may change roles
  if (res.locals.user.role !== 'admin') {
    delete req.body.role;
  }
  // Never store a plain text password
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  const result = await modifyUserById(req.params.id, req.body);
  if (result) {
    res.status(200).json({message: 'User updated successfully'});
  } else {
    const error = new Error('User not found');
    error.status = 404;
    next(error);
  }
};
