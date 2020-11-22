const express = require('express');

const mongoose = require('mongoose');

const routes = require('./routes');

const app = express();

mongoose.connect('mongodb+srv://patriarca:patriarca@cluster0.jyc97.mongodb.net/patriarca_tapetes?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(routes);
app.listen(3333);

app.get('/', async (req, res) => {
    res.send('Executando!');
});