const express = require('express');

const routes = express.Router();

const ClienteControle = require('./Controllers/ClienteControle');
const PedidoControle = require('./Controllers/PedidoControle');

routes.post('/clienteFisico', ClienteControle.PessoaFisica.cadastrarCliente);
routes.post('/clienteJuridico', ClienteControle.PessoaJuridica.cadastrarCliente);
routes.post('/clienteOrgaoPublico', ClienteControle.OrgaoPublico.cadastrarCliente)
routes.get('/clientes', ClienteControle.listarTodosClientes);
routes.get('/clientes/:id', ClienteControle.Cliente.pegarCliente);
routes.delete('/clientes/:id', ClienteControle.Cliente.excluirCliente);
routes.patch('/clientes/:id', ClienteControle.Cliente.editarCliente);

routes.post('/pedidos', PedidoControle.Pedido.novoPedido);
routes.get('/pedidos', PedidoControle.listarTodosPedidos);
routes.get('/pedidos/:id', PedidoControle.Pedido.pegarPedido);
routes.patch('/pedidos/:id', PedidoControle.Pedido.editarPedido);
routes.delete('/pedidos/:id', PedidoControle.Pedido.excluirPedido);

module.exports = routes;
