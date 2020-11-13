const express = require('express');

const routes = express.Router();

const Cliente = require('./Controllers/ClientController');

const cliente1 = new Cliente("Jean", "4499999999", "AV Brazil", "jean@gmail.com");

// console.log(cliente1);

routes.post( '/clientes', cliente1.cadastrarCliente );

module.exports = routes;