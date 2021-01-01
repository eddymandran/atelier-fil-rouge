const express = require('express');
const connection = require("./connection");

const app = express();

// route principal pour l'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue dans la quête Atelier Fil Rouge');
});

// route pour récupérer tous les utilisateurs
app.get('/api/users/', (req, res) => {
  connection.query('SELECT * from myTable', (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      res.status(200).json(results);
    }
  });
});


// route pour récupérer tous les utilisateurs avec uniquement le nom, prenom et la date d'inscription
app.get('/api/users/light', (req, res) => {
  connection.query('SELECT nom, prenom, date_inscription from myTable', (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      res.status(200).json(results);
    }
  });
});






app.listen(5000, () => console.log('server listening on port 5000'));
