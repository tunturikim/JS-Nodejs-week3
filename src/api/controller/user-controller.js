import {
  listAllUsers,
  findUserById,
  addUser,
  removeUserById,
  modifyUserById,
} from '../model/user-model.js';

export const getUsers = async (req, res) => {
  const users = await listAllUsers();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({error: '404', message: 'User not found'});
  }
};

export const postUser = async (req, res) => {
  const result = await addUser(req.body);
  if (result) {
    res.status(201).json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

export const deleteUserById = async (req, res) => {
  // Also deletes the user's cats (transaction in the model)
  const result = await removeUserById(req.params.id);
  if (result) {
    res.status(200).json({message: 'User deleted successfully'});
  } else {
    res.status(404).json({error: '404', message: 'User not found'});
  }
};

export const putUserById = async (req, res) => {
  const result = await modifyUserById(req.params.id, req.body);
  if (result) {
    res.status(200).json({message: 'User updated successfully'});
  } else {
    res.status(404).json({error: '404', message: 'User not found'});
  }
};
