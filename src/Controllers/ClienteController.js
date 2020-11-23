const { PessoaFisica, PessoaJuridica, OrgaoPublico } = require('../Models/Cliente');
const { ObjectId } = require('mongodb');
const bd = require("../bancoDados.js");

module.exports = {
    async CadastrarCliente(req, res) {

        try {
            const collectionClientes = await bd.conectarBancoDados('clientes');

            let novoCliente;

            let clienteExiste = await collectionClientes.findOne({ [req.body.tipoDocumento]: req.body.documento });

            if (clienteExiste) return res.status(400).json('Cliente já existente!');

            if (req.body.tipoDocumento === 'cpf') novoCliente = new PessoaFisica(req.body);
            if (req.body.tipoDocumento === 'cnpj') novoCliente = new PessoaJuridica(req.body);
            if (req.body.tipoDocumento === 'sigla') novoCliente = new OrgaoPublico(req.body);

            collectionClientes.insertOne(novoCliente);

            return res.status(200).json(novoCliente);
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao cadastrar o cliente.');
        }

    },

    async EditarCliente(req, res) {
        try {

            if (ObjectId.isValid(req.params.id) === false)
                return res.status(400).json('ID inválido.');

            const novosDados = { [req.body.tipoDocumento]: req.body.documento } = req.body;

            delete novosDados.documento;

            const collectionClientes = await bd.conectarBancoDados('clientes');

            const documentoCliente = await collectionClientes.findOne({ _id: ObjectId(req.params.id) });

            if (!documentoCliente)
                return res.status(404).json('Cliente inexistente.');

            collectionClientes.updateOne(documentoCliente, { $set: novosDados });

            return res.status(200).json(novosDados);
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao atualizar as informações do cliente.');
        }
    },

    async ApagarCliente(req, res) {

        try {
            if (ObjectId.isValid(req.params.id) === false)
                return res.status(400).json('ID inválido.');

            const collectionPedidos = await bd.conectarBancoDados('pedidos');
            const collectionClientes = await bd.conectarBancoDados('clientes');

            const pedidos = await collectionPedidos.findOne({ idCliente: req.params.id, statusPedido: "EM_SEPARACAO" });

            if (pedidos)
                return res.status(400).json('Não é possível realizar a exclusão. O cliente possui pedidos em aberto.');

            const documento = await collectionClientes.findOne({ _id: ObjectId(req.params.id) });

            if (!documento)
                return res.status(404).json('Cliente inexistente!');

            await collectionClientes.deleteOne({ _id: ObjectId(req.params.id) });

            return res.status(400).json("Cliente excluído com sucesso!");
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao apagar o cliente.');
        }
    },

    async PegarCliente(req, res) {
        try {
            if (ObjectId.isValid(req.params.id) === false) return res.status(400).json('ID inválido.');

            const collectionClientes = await bd.conectarBancoDados('clientes');
            const cliente = await collectionClientes.findOne({ _id: ObjectId(req.params.id) });

            if (!cliente)
                return res.status(404).json('Cliente inexistente.');

            return res.status(200).json(cliente);
        } catch (err) {
            console.log(err);
            return res.status(400).json("Erro no carregamento das informações do cliente.");
        };
    },

    async ListarClientes(req, res) {
        try {
            const collectionClientes = await bd.conectarBancoDados('clientes');
            const clientes = await collectionClientes.find({}).toArray();

            res.status(200).json(clientes);
        } catch (err) {
            console.log(err);
            return res.status(400).json("Erro no carregamento das informações.");
        };
    }
};