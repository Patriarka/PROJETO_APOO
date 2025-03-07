const { PessoaFisica, PessoaJuridica, OrgaoPublico } = require('../Models/Cliente');
const { ObjectId } = require('mongodb');
const bd = require("../bancoDados.js");
const { cpf, cnpj } = require('cpf-cnpj-validator'); 

module.exports = {
    async cadastrarCliente(req, res) {

        try {
            const collectionClientes = await bd.conectarBancoDados('clientes');

            let novoCliente;

            let clienteExiste = await collectionClientes.findOne({ [req.body.tipoDocumento]: req.body.documento });

            if (clienteExiste) return res.status(400).json('Cliente já existente!');

            if (req.body.tipoDocumento === 'cpf'){
                let cpfValido = cpf.isValid(req.body.documento);

                if(cpfValido === false)
                    return res.status(400).json('CPF inválido');
                
                novoCliente = new PessoaFisica(req.body);
            }
            if (req.body.tipoDocumento === 'cnpj'){
                let cnpjValido = cnpj.isValid(req.body.documento);
                
                if(cnpjValido === false)
                    return res.status(400).json('CNPJ inválido.');
    
                novoCliente = new PessoaJuridica(req.body);
            }
            if (req.body.tipoDocumento === 'sigla') novoCliente = new OrgaoPublico(req.body);

            collectionClientes.insertOne(novoCliente);

            return res.status(200).json(novoCliente);
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao cadastrar o cliente.');
        }

    },

    async editarCliente(req, res) {
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

    async excluirCliente(req, res) {

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

    async listarCliente(req, res) {
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

    async listarClientes(req, res) {
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