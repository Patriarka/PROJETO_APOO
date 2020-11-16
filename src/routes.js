const express = require('express');

const routes = express.Router();

const ClienteControle = require('./Controllers/ClienteControle');
const PedidoControle = require('./Controllers/PedidoControle');

routes.post('/clienteFisico', ClienteControle.PessoaFisica.cadastrarCliente);
routes.post('/clienteJuridico', ClienteControle.PessoaJuridica.cadastrarCliente);
routes.post('/clienteOrgaoPublico', ClienteControle.OrgaoPublico.cadastrarCliente);
routes.get('/clientes', ClienteControle.listarTodosClientes);
routes.get('/clientes/:id', ClienteControle.Cliente.listarCliente);
routes.patch('/clientes/:id', ClienteControle.Cliente.editarCliente);
routes.delete('/clientes/:id', ClienteControle.Cliente.excluirCliente);

routes.post('/pedidos', PedidoControle.Pedido.novoPedido);
routes.get('/pedidos', PedidoControle.listarTodosPedidos);
routes.get('/pedidos/:id', PedidoControle.Pedido.listarPedido);
routes.patch('/pedidos/:id', PedidoControle.Pedido.editarPedido);
routes.delete('/pedidos', PedidoControle.Pedido.excluirPedido);

//  const factoryController = new factoryController();
//  const productController = new ProductsController(); 
//  routes.post('/clientes', ClienteControle.Cliente.cadastrarCliente);



module.exports = routes;