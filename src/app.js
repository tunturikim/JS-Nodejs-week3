import express from 'express';
import router from './api/index.js';
import requestTime from './middlewares/request-time.js';
import {notFoundHandler, errorHandler} from './middlewares/error-handlers.js';
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

// 404 and error handlers must be registered after all routes
app.use(notFoundHandler);
app.use(errorHandler);

// Käynnistetään HTTP-palvelin kuuntelemaan määritettyä porttia ja isäntänimeä
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
