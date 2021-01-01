const express = require('express');
const connection = require("./connection");

const app = express();

// route principal pour l'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue dans la quête Atelier Fil Rouge');
});







app.listen(5000, () => console.log('server listening on port 5000'));
