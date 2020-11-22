const express = require('express');

const routes = express.Router();

const ClienteController = require('./Controllers/ClienteController');
const PedidoController = require('./Controllers/PedidoController');
const ProdutoController = require('./Controllers/ProdutoController');
const FabricaController = require('./Controllers/FabricaController');

routes.post('/clientes', ClienteController.CadastrarCliente);
routes.patch('/clientes/:id', ClienteController.EditarCliente);
routes.delete('/clientes/:id', ClienteController.ApagarCliente);
routes.get('/clientes', ClienteController.ListarClientes);
routes.get('/clientes/:id', ClienteController.PegarCliente);

routes.post('/pedidos', PedidoController.NovoPedido);
routes.get('/pedidos/:id', PedidoController.PegarPedido);
routes.get('/pedidos', PedidoController.listarTodosPedidos);
routes.delete('/pedidos/:id', PedidoController.ExcluirPedido);

routes.post('/produtos', ProdutoController.NovoProduto);
routes.delete('/produtos/:id', ProdutoController.ApagarProduto);
routes.get('/produtos', ProdutoController.ListarProdutos);

routes.post('/fabricas', FabricaController.NovaFabrica); 
routes.get('/fabricas', FabricaController.ListarFabricas); 

module.exports = routes;
