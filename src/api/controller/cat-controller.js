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

export const getCatById = async (req, res) => {
  const id = req.params.id;
  const cat = await findCatById(id);
  if (cat) {
    res.status(200).json(cat);
  } else {
    res.status(404).json({error: '404', message: 'Cat not found'});
  }
};

export const postCat = async (req, res) => {
  console.log('request', req.body);
  console.log(req.file);
  console.log(req.file.filename);
  req.body.filename = req.file.filename;
  // The owner is always the logged-in user
  req.body.owner = res.locals.user.user_id;

  const result = await addCat(req.body);
  if (result) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

export const deleteCatById = async(req, res) => {
  const result = await removeCatById(req.params.id, res.locals.user);
  if (result) {
    res.status(200).json({message: 'Cat deleted successfully'});
  } else {
    res.status(404).json({error: '404', message: 'Cat not found or not yours'});
  }
};

export const putCatById = async (req, res) => {
  // Only admin may change the owner of a cat
  if (res.locals.user.role !== 'admin') {
    delete req.body.owner;
  }
  const result = await modifyCatById(req.params.id, req.body, res.locals.user);
  if (result) {
    res.status(200).json({message: 'Cat updated successfully'});
  } else {
    res.status(404).json({error: '404', message: 'Cat not found or not yours'});
  }
};
