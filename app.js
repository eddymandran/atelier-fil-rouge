const express = require('express');
const connection = require('./connection');

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
// route pour récupérer tous les utilisateurs avec uniquement le nom, prenom et la date d'inscription
app.get('/api/users/light', (req, res) => {
  connection.query(
    'SELECT nom, prenom, date_inscription FROM myTable',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error retrieving data');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// route pour récupérer tous les utilisateurs avec un filtre "contient ..." sur la colonne nom
app.get('/api/users/nameContains', (req, res) => {
  const name = `%${req.query.name}%`;
  connection.query(
    'SELECT * FROM myTable WHERE nom LIKE ?',
    name,
    (err, results) => {
      if (err) {
        return res.status(500).json({ err: err.message, sql: err.sql });
      }
      if (results.length === 0) {
        res.status(200).send('No users match');
      }
      return res.status(200).json(results);
    }
  );
});

// route pour récupérer tous les utilisateurs avec un filtre "commence par ..." sur la colonne nom
app.get('/api/users/nameStart', (req, res) => {
  const name = `${req.query.name}%`;
  connection.query(
    'SELECT * FROM myTable WHERE nom LIKE ?',
    name,
    (err, results) => {
      if (err) {
        return res.status(500).json({ err: err.message, sql: err.sql });
      }
      if (results.length === 0) {
        res.status(200).send('No users match');
      }
      return res.status(200).json(results);
    }
  );
});

// route pour récupérer tous les utilisateurs avec un filtre "superieur à ..." sur la colonne nbre_followers
app.get('/api/users/followers', (req, res) => {
  connection.query(
    'SELECT * FROM myTable WHERE nbre_followers > ?',
    req.query.nbre_followers,
    (err, results) => {
      if (err) {
        return res.status(500).json({ err: err.message, sql: err.sql });
      }
      if (results.length === 0) {
        res.status(200).send('No users match');
      }
      return res.status(200).json(results);
    }
  );
});

// route permettant de récupérer les données ordonnées par date d'inscription
app.get('/api/users/:order', (req, res) => {
  const orderBy = req.params.order;
  connection.query(
    `SELECT * FROM myTable ORDER BY date_inscription ${orderBy}`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ err: err.message, sql: err.sql });
      }
      return res.status(200).json(results);
    }
  );
});

// route pour ajouter un nouveau utilisateur
app.post('/api/users', (req, res) => {
  connection.query(
    'SELECT * FROM myTable WHERE nom = ?',
    req.body.nom,
    (err, results) => {
      if (err) {
        return res.status(500).json({ err: err.message, sql: err.sql });
      }
      if (results.length !== 0) {
        return res.status(422).send('This user already exist');
      }
      connection.query(
        'INSERT INTO myTable SET ?',
        req.body,
        (err2, results2) => {
          if (err2) {
            return res.status(500).json({ err: err2.message, sql: err2.sql });
          }
          connection.query(
            'SELECT * FROM myTable WHERE id = ?',
            results2.insertId,
            (err3, results3) => {
              if (err3) {
                return res
                  .status(500)
                  .json({ err: err3.message, sql: err3.sql });
              }
              res.status(201).json(results3[0]);
            }
          );
        }
      );
    }
  );
});

// route permettant de mettre à jour un utilisateurs
app.put('/api/users/:id', (req, res) => {
  const idUser = req.params.id;
  const userUpdated = req.body;
  connection.query(
    'UPDATE myTable SET ? WHERE id = ?',
    [userUpdated, idUser],
    (err) => {
      if (err) {
        return res.status(500).json({ err: err.message, sql: err.sql });
      }
      connection.query(
        'SELECT * FROM myTable WHERE id = ?',
        idUser,
        (err2, results2) => {
          if (err2) {
            return res.status(500).json({ err: err.message, sql: err.sql });
          }
          if (results2.length === 0) {
            return res.status(404).send('can not find the user');
          }
          return res.status(200).json(results2);
        }
      );
    }
  );
});

app.listen(5000, () => console.log('server listening on port 5000'));
