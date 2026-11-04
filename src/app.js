import express from 'express';
import router from './api/index.js';
import requestTime from './middlewares/request-time.js';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.use(express.static('public'));

// Middleware to add request time to req object
app.use(requestTime);

// Needed to parse JSON bodies in POST requests
app.use(express.json());

// Parses URL-encoded form data (like HTML forms)
app.use(express.urlencoded({extended: true}));

// Ohjaus kaikille /api/v1 -alkuisille reiteille api/index.js -tiedostoon
app.use('/api/v1', router);

// Käynnistetään HTTP-palvelin kuuntelemaan määritettyä porttia ja isäntänimeä
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
