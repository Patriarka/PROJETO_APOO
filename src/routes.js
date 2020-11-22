const express = require('express');

const routes = express.Router();

const ClienteControle = require('./Controllers/ClienteControle');
const PedidoControle = require('./Controllers/PedidoControle');
const ProdutoControle = require('./Controllers/ProdutoControle');
const FabricaControle = require('./Controllers/FabricaControle');

routes.post('/clienteFisico', ClienteControle.PessoaFisica.cadastrarCliente);
routes.post('/clienteJuridico', ClienteControle.PessoaJuridica.cadastrarCliente);
routes.post('/clienteOrgaoPublico', ClienteControle.OrgaoPublico.cadastrarCliente);

routes.get('/clientes', ClienteControle.listarClientes);
routes.get('/clientes/:id', ClienteControle.Cliente.pegarCliente);
routes.delete('/clientes/:id', ClienteControle.Cliente.excluirCliente);
routes.patch('/clientes/:id', ClienteControle.Cliente.editarCliente);

routes.post('/pedidos/cliente', PedidoControle.PedidoCliente.novoPedido);
routes.post('/pedidos/empresa', PedidoControle.PedidoEmpresa.novoPedido);
routes.get('/pedidos', PedidoControle.listarTodosPedidos);
routes.get('/pedidos/:id', PedidoControle.PedidoEmpresa.pegarPedido);
routes.delete('/pedidos/:id', PedidoControle.PedidoEmpresa.excluirPedido);

routes.post('/produtos/tapetes', ProdutoControle.Tapete.novoProduto);
routes.post('/produtos/bandeiras', ProdutoControle.Bandeira.novoProduto);
routes.get('/produtos', ProdutoControle.listarProdutos);

routes.post('/fabricas', FabricaControle.Fabrica.novaFabrica);

module.exports = routes;
