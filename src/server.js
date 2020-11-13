const express = require('express');
//const mongoose = require('mongoose')

const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(routes);
app.listen(3333);

app.get('/', async (req, res) => {
    res.send('rodando.');
})
