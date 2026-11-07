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

export const getUserById = async (req, res) => {
  const id = req.params.id;
  const user = await findUserById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({error: '404', message: 'User not found'});
  }
};

export const getUserByUsername =  async (req, res) => {
  const username = req.params.username;
  const user = await findUserByUsername(username);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({error: '404', message: 'User not found'});
  }
};

export const postUser = async (req, res) => {
  // Hash the password before storing it
  req.body.password = bcrypt.hashSync(req.body.password, 10); 
  console.log('request body', req.body);
  const result = await addUser(req.body);
  if (result) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

// Admin or the user themselves may modify/delete the user
const canModifyUser = (req, res) => {
  const {user_id, role} = res.locals.user;
  return role === 'admin' || user_id === Number(req.params.id);
};

export const deleteUserById = async (req, res) => {
  if (!canModifyUser(req, res)) {
    return res.status(403).json({message: 'Forbidden'});
  }
  const result = await removeUserById(req.params.id);
  if (result) {
    res.status(200).json({message: 'User deleted successfully'});
  } else {
    res.status(404).json({error: '404', message: 'User not found'});
  }
};

export const putUserById = async (req, res) => {
  if (!canModifyUser(req, res)) {
    return res.status(403).json({message: 'Forbidden'});
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
    res.status(404).json({error: '404', message: 'User not found'});
  }
};
