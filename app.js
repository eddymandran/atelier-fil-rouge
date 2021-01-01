const express = require('express');

const app = express();

app.get('/myroute', (req, res) => {
  console.log('handling /myroute');
  res.send('content for /myroute');
});

app.listen(5000, () => console.log('server listening on port 5000'));
