const express = require('express');
const connection = require("./connection");

const app = express();
app.use(express.json());


// route principal pour l'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue dans la quête Atelier Fil Rouge');
});

// route pour récupérer tous les utilisateurs
app.get('/api/users/', (req, res) => {
  connection.query('SELECT * FROM myTable', (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      res.status(200).json(results);
    }
  });
});




// route pour récupérer tous les utilisateurs avec un filtre "commence par ..." sur la colonne nom
app.get('/api/users/filteredby/nameStart', (req, res) => {
  const startLetters = `%${req.query.name}`;
  connection.query('SELECT * FROM myTable WHERE nom LIKE ?', startLetters,
   (err, results) => {
    if (err) {
      return res.status(500).json({ err: err.message, sql: err.sql });
    } if (results.length === 0) {
      res.status(200).send("No users match");
    }
    return res.status(200).json(results);
  }
  );
}); 

// route pour récupérer tous les utilisateurs avec un filtre "superieur à ..." sur la colonne nbre_followers
app.get('/api/users/filteredby/followers', (req, res) => {
  connection.query('SELECT * FROM myTable WHERE nbre_followers > ?', req.query.nbre_followers,
   (err, results) => {
    if (err) {
      return res.status(500).json({ err: err.message, sql: err.sql });
    } if (results.length === 0) {
      res.status(200).send("No users match");
    }
    return res.status(200).json(results);
  }
  );
}); 

// route permettant de récupérer les données ordonnées par date d'inscription
app.get("/api/users/:order", (req, res) => {
  const orderBy = req.params.order;
  connection.query(`SELECT * FROM myTable ORDER BY date_inscription ${orderBy}`, (err, results) => {
    if (err) {
      return res.status(500).json({ err: err.message, sql: err.sql });
    } 
    return res.status(200).json(results);
  }
  );
});


app.listen(5000, () => console.log('server listening on port 5000'));
