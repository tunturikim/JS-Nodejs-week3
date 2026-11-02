import {
  listAllCats,
  findCatById,
  addCat,
  removeCatById,
  modifyCatById,
} from '../model/cat-model.js';

export const getCats = (req, res) => {
  // This is an API endpoint that returns a list of cats
  res.json(listAllCats());
};

export const getWelcomeMessage = (req, res) => {
  res.send('Welcome to my REST API, moi!');
};

export const getCatById = (req, res) => {
  const id = req.params.id;
  const cat = findCatById(id);
  if (cat) {
    res.status(200).json(cat);
  } else {
    res.status(404).json({error: '404', message: 'Cat not found'});
  }
};

export const postCat = (req, res) => {
  console.log('request body', req.body);
  const newId = addCat(req.body);
  res.status(201).json({cat_id: newId});
};

export const deleteCatById = (req, res) => {
  const result = removeCatById(req.params.id);
  if (result) {
    res.status(200).json({message: 'Cat deleted successfully'});
  } else {
    res.status(404).json({error: '404', message: 'Cat not found'});
  }
};

export const putCatById = (req, res) => {
  const result = modifyCatById(req.params.id, req.body);
  if (result) {
    res.status(200).json({message: 'Cat updated successfully'});
  } else {
    res.status(404).json({error: '404', message: 'Cat not found'});
  }
};
