// mock data for user model
/*
const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3608,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@metropolia.fi',
    role: 'user',
    password: 'password',
  },
  {
    user_id: 3607,
    name: 'Admin User',
    username: 'adminuser',
    email: 'sysadmin@metropolia.fi',
    role: 'admin',
    password: 'password',
  },
];

const listAllUsers = () => {
  return userItems;
};

const findUserById = (id) => {
  return userItems.find((item) => item.user_id == id);
};

const addUser = (user) => {
  const {name, username, email, role, password} = user;
  const newId = userItems[0].user_id + 1;
  userItems.unshift({
    user_id: newId,
    name,
    username,
    email,
    role,
    password,
  });
  return newId;
};

const removeUserById = (id) => {
  const index = userItems.findIndex((user) => user.user_id == id);
  userItems.splice(index, 1);
  return index !== -1;
};

const modifyUserById = (id, newUserData) => {
  const index = userItems.findIndex((user) => user.user_id == id);
  // Create a new object that combines the existing user data with the new data
  userItems[index] = {...userItems[index], ...newUserData};
  return index !== -1;
};

export {listAllUsers, findUserById, addUser, removeUserById, modifyUserById};
