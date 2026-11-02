import express from 'express';
import router from './api/index.js';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.use('/public', express.static('public'));
app.use(express.json());

// Ohjaus kaikille /api/v1 -alkuisille reiteille api/index.js -tiedostoon
app.use('/api/v1', router);

// Käynnistetään HTTP-palvelin kuuntelemaan määritettyä porttia ja isäntänimeä
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
