import {
  listAllCats,
  findCatById,
  addCat,
  removeCatById,
  modifyCatById,
} from '../model/cat-model.js';

export const getCats = async (req, res) => {
  // This is an API endpoint that returns a list of cats
  console.log('Ollaan controllerissa');
  const cats = await listAllCats();
  //res.json(listAllCats());
  res.json({
    requestTime: req.requestTime,
    time: req.requestTime,
    cats: cats,
  });
};

export const getWelcomeMessage = (req, res) => {
  res.send('Welcome to my REST API, moi!');
};

export const getCatById = async (req, res, next) => {
  const id = req.params.id;
  const cat = await findCatById(id);
  if (cat) {
    res.status(200).json(cat);
  } else {
    const error = new Error('Cat not found');
    error.status = 404;
    next(error);
  }
};

export const postCat = async (req, res, next) => {
  if (!req.file) {
    const error = new Error('Invalid or missing file');
    error.status = 400;
    return next(error);
  }
  req.body.filename = req.file.filename;
  // The owner is always the logged-in user
  req.body.owner = res.locals.user.user_id;

  const result = await addCat(req.body);
  if (result) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    const error = new Error('Could not add cat');
    error.status = 400;
    next(error);
  }
};

export const deleteCatById = async (req, res, next) => {
  const result = await removeCatById(req.params.id, res.locals.user);
  if (result) {
    res.status(200).json({message: 'Cat deleted successfully'});
  } else {
    const error = new Error('Cat not found or not yours');
    error.status = 404;
    next(error);
  }
};

export const putCatById = async (req, res, next) => {
  // Only admin may change the owner of a cat
  if (res.locals.user.role !== 'admin') {
    delete req.body.owner;
  }
  const result = await modifyCatById(req.params.id, req.body, res.locals.user);
  if (result) {
    res.status(200).json({message: 'Cat updated successfully'});
  } else {
    const error = new Error('Cat not found or not yours');
    error.status = 404;
    next(error);
  }
};
