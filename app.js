import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

// Mock data for cats
const cats = [
  {
    cat_id: 1,
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
    cat_id: 3,
    name: 'Pörrö',
    age: 1,
    birthdate: '2022-01-10',
    weight: 3.8,
    owner: 'Charlie',
    image: 'https://placecats.com/300/200',
  },
];

app.get('/', (req, res) => {
  res.send('Welcome to my REST API, moi!');
});

app.get('/api/v1/cats', (req, res) => {
  // Tämä on API-endpointti, joka palauttaa listan kissoista
  res.json(cats);
});

// GET http://localhost:3000/api/v1/cats/99
// property name (id) is set in the route definition
app.get('/api/v1/cats/:id', (req, res) => {
  console.log('path variables', req.params);
  for (const cat of cats) {
    if (cat.cat_id === parseInt(req.params.id)) {
      res.json(cat);
      return;
    }
  }

  res.sendStatus(404);
});

app.post('/api/v1/cats', (req, res) => {
  console.log('request body', req.body);
  cats.push(req.body);
  res.status(201);
  res.json({message: 'Cat added successfully'});
});

// Käynnistetään HTTP-palvelin kuuntelemaan määritettyä porttia ja isäntänimeä
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use('/public', express.static('public'));

app.use(express.json());
