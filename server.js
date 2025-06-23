  const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Generar rutas CRUD para cada colección del db.json
Object.keys(db).forEach((key) => {
  // GET ALL
// GET ALL o FILTRADO por query
app.get(`/${key}`, (req, res) => {
  const queryKeys = Object.keys(req.query);
  if (queryKeys.length === 0) {
    return res.json(db[key]); // sin filtros
  }

  const filtered = db[key].filter(item =>
    queryKeys.every(q => String(item[q]).toLowerCase() === String(req.query[q]).toLowerCase())
  );

  res.json(filtered);
});


  // GET BY ID
  app.get(`/${key}/:id`, (req, res) => {
   const item = db[key].find(i => String(i.id) === req.params.id);
    item ? res.json(item) : res.sendStatus(404);
  });
  
  // POST
  app.post(`/${key}`, (req, res) => {
    const nuevo = req.body;
    nuevo.id = key.slice(0, 2).toUpperCase() + Math.floor(Math.random() * 10000);
    db[key].push(nuevo);
    res.status(201).json(nuevo);
  });

  // PUT
  app.put(`/${key}/:id`, (req, res) => {
    const index = db[key].findIndex(i => i.id == req.params.id);
    if (index !== -1) {
      db[key][index] = { ...req.body, id: req.params.id };
      res.json(db[key][index]);
    } else res.sendStatus(404);
  });

  // DELETE
  app.delete(`/${key}/:id`, (req, res) => {
    const index = db[key].findIndex(i => i.id == req.params.id);
    if (index !== -1) {
      db[key].splice(index, 1);
      res.sendStatus(204);
    } else res.sendStatus(404);
  });
});

app.listen(PORT, () => {
  console.log(`API RAJE corriendo en puerto ${PORT}`);
});
