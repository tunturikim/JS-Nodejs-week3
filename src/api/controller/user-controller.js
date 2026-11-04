import {
  listAllUsers,
  findUserById,
  addUser,
  removeUserById,
  modifyUserById,
} from '../model/user.model.js';

export const getUsers = (req, res) => {
  res.json(listAllUsers());
};

export const getUserById = (req, res) => {
  const id = req.params.id;
  const user = findUserById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({error: '404', message: 'User not found'});
  }
};

export const postUser = (req, res) => {
  console.log('request body', req.body);
  const newId = addUser(req.body);
  res.status(201).json({user_id: newId});
};

export const deleteUserById = (req, res) => {
  const result = removeUserById(req.params.id);
  if (result) {
    res.status(200).json({message: 'User deleted successfully'});
  } else {
    res.status(404).json({error: '404', message: 'User not found'});
  }
};

export const putUserById = (req, res) => {
  const result = modifyUserById(req.params.id, req.body);
  if (result) {
    res.status(200).json({message: 'User updated successfully'});
  } else {
    res.status(404).json({error: '404', message: 'User not found'});
  }
};
