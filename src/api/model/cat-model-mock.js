// Mock data for cats
const cats = [
  {
    cat_id: 3,
    name: 'Misu',
    age: 2,
    birthdate: '2021-05-15',
    weight: 4.5,
    owner: 'Alice',
    image: 'https://placekitten.com/200/300',
  },
  {
    cat_id: 2,
    name: 'Kisu',
    age: 3,
    birthdate: '2020-06-20',
    weight: 5.2,
    owner: 'Bob',
    image: 'https://placekitten.com/300/200',
  },
  {
    cat_id: 1,
    name: 'Pörrö',
    age: 1,
    birthdate: '2022-01-10',
    weight: 3.8,
    owner: 'Charlie',
    image: 'https://placecats.com/300/200',
  },
];

const listAllCats = () => {
  return cats;
};

const findCatById = (id) => {
  return cats.find((item) => item.cat_id == id);
};

const addCat = (cat) => {
  const {name, age, birthdate, weight, owner, image} = cat;
  const newId = cats[0].cat_id + 1;
  cats.unshift({
    cat_id: newId,
    name,
    age,
    birthdate,
    weight,
    owner,
    image,
  });
  return newId;
};

const removeCatById = (id) => {
  const index = cats.findIndex((cat) => cat.cat_id == id);
  cats.splice(index, 1);
  return index !== -1;
};

const modifyCatById = (id, newCatData) => {
  const index = cats.findIndex((cat) => cat.cat_id == id);
  // Create a new object that combines the existing cat data with the new data
  cats[index] = {...cats[index], ...newCatData};
  return index !== -1;
};

export {listAllCats, findCatById, addCat, removeCatById, modifyCatById};
