const express = require('express');

const routes = express.Router();

const ClienteController = require('./Controllers/ClienteController');
const PedidoController = require('./Controllers/PedidoController');
const ProdutoController = require('./Controllers/ProdutoController');
const FabricaController = require('./Controllers/FabricaController');

routes.post('/clientes', ClienteController.cadastrarCliente);
routes.get('/clientes', ClienteController.listarClientes);
routes.get('/clientes/:id', ClienteController.listarCliente);
routes.patch('/clientes/:id', ClienteController.editarCliente);
routes.delete('/clientes/:id', ClienteController.excluirCliente);

routes.post('/pedidos', PedidoController.cadastrarPedido);
routes.get('/pedidos', PedidoController.listarPedidos);
routes.get('/pedidos/:id', PedidoController.listarPedido);
routes.delete('/pedidos/:id', PedidoController.excluirPedido);

routes.post('/produtos', ProdutoController.cadastrarProduto);
routes.get('/produtos', ProdutoController.listarProdutos);
routes.get('/produtos/:id', ProdutoController.listarProduto);
routes.delete('/produtos/:id', ProdutoController.excluirProduto);

routes.post('/fabricas', FabricaController.cadastrarFabrica); 
routes.get('/fabricas', FabricaController.listarFabricas);
routes.get('/fabricas/:id', FabricaController.listarFabrica);
routes.patch('/fabricas/:id', FabricaController.editarFabrica);
routes.delete('/fabricas/:id', FabricaController.excluirFabrica);

module.exports = routes;