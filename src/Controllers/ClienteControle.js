const { ObjectId } = require('mongodb');
const funcoesBancoDados = require("../bancoDados.js");

class Cliente {

    constructor(nome, telefone, endereco, email) {
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.email = email;
    };

    static async cadastrarCliente(req, res) {

        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

        // verificar se a conexão com o banco falhou

        let novoCliente = {}, usuarioExiste = {};

        usuarioExiste = await collectionClientes.findOne({ [req.body.tipoDocumento]: req.body.documento });

        if (usuarioExiste)
            return res.status(400).json('Cliente existente.');

        if (req.body.tipoDocumento === 'cpf')
            novoCliente = new PessoaFisica(req.body.nome, req.body.telefone, req.body.endereco, req.body.email, req.body.documento)
        else if (req.body.tipoDocumento === 'cnpj')
            novoCliente = new PessoaJuridica(req.body.nome, req.body.telefone, req.body.endereco, req.body.email, req.body.documento)
        else if (req.body.tipoDocumento === 'sigla')
            novoCliente = new OrgaoPublico(req.body.nome, req.body.telefone, req.body.endereco, req.body.email, req.body.documento);

        await collectionClientes.insertOne(novoCliente);

        return res.status(200).json(novoCliente);
    };

    static async listarCliente(req, res) {

        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

        try {
            const cliente = await collectionClientes.findOne({ _id: ObjectId(req.params.id) });

            if (!cliente)
                return res.status(400).json('Cliente não cadastrado.');

            return res.status(200).json(cliente);
        } catch (err) {
            return res.status(400).json("Erro no carregamento das informações.");
        };
    };

    static async excluirCliente(req, res) {
        try {

            const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');


            const clienteExcluido = await collectionClientes.deleteOne({ _id: ObjectId(req.params.id) });

            // verificar se o cliente possui algum pedido em aberto

            return res.status(400).json(clienteExcluido);
        } catch (err) {
            return res.status(400).json("Erro.")
        }
    };

    static async editarCliente(req, res) {

        try {
            const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

            const documentoCliente = await collectionClientes.findOne({ _id: ObjectId(req.params.id) });

            if (!documentoCliente)
                return res.status(400).json('Cliente não cadastrado.');

            // pode atualizar o tipo de documento ? 
            let documentoAtualizado = await collectionClientes.updateOne(documentoCliente, { $set: { nome: req.body.nome, endereco: req.body.endereco, email: req.body.email, telefone: req.body.telefone, [req.body.tipoDocumento]: [req.body.documento] } });

            return res.status(200).json(documentoAtualizado);
        } catch (err) {
            return res.status(400).json('Erro ao atualizar as informações.');
        }
    };
};

class PessoaFisica extends Cliente {
    constructor(nome, telefone, endereco, email, cpf) {
        super(nome, telefone, endereco, email)
        this.cpf = cpf;
    }

    static async cadastrarCliente(req, res) {
        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

        let novoCliente = {}, usuarioExiste = {};

        usuarioExiste = await collectionClientes.findOne({ [req.body.tipoDocumento]: req.body.documento });

        if (usuarioExiste)
            return res.status(400).json('Cliente existente.');

        novoCliente = new PessoaFisica(req.body.nome, req.body.telefone, req.body.endereco, req.body.email, req.body.documento)

        await collectionClientes.insertOne(novoCliente);

        return res.status(200).json(novoCliente);
    };
};

class PessoaJuridica extends Cliente {
    constructor(nome, telefone, endereco, email, cnpj) {
        super(nome, telefone, endereco, email);
        this.cnpj = cnpj;
    };

    static async cadastrarCliente(req, res) {
        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

        let novoCliente = {}, usuarioExiste = {};

        usuarioExiste = await collectionClientes.findOne({ [req.body.tipoDocumento]: req.body.documento });

        if (usuarioExiste)
            return res.status(400).json('Cliente existente.');

        novoCliente = new PessoaJuridica(req.body.nome, req.body.telefone, req.body.endereco, req.body.email, req.body.documento)

        await collectionClientes.insertOne(novoCliente);

        return res.status(200).json(novoCliente);
    };
};

class OrgaoPublico extends Cliente {
    constructor(nome, telefone, endereco, email, sigla) {
        super(nome, telefone, endereco, email);
        this.sigla = sigla;
    };

    static async cadastrarCliente(req, res) {
        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

        let novoCliente = {}, usuarioExiste = {};

        usuarioExiste = await collectionClientes.findOne({ [req.body.tipoDocumento]: req.body.documento });

        if (usuarioExiste)
            return res.status(400).json('Cliente existente.');

        novoCliente = new OrgaoPublico(req.body.nome, req.body.telefone, req.body.endereco, req.body.email, req.body.documento);

        await collectionClientes.insertOne(novoCliente);

        return res.status(200).json(novoCliente);
    };
};

async function listarTodosClientes(req, res) {
    try {
        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

        const clientes = await collectionClientes.find({}).toArray();

        return res.status(200).json(clientes);
    } catch (err) {
        console.log(err);
        return res.status(400).json("Erro no carregamento das informações.");
    };
};

module.exports = { Cliente, listarTodosClientes, PessoaFisica, PessoaJuridica, OrgaoPublico };