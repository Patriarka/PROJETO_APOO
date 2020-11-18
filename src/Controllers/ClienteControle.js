const { ObjectId } = require('mongodb');

const funcoesBancoDados = require("../bancoDados.js");

class Cliente {

    constructor(nome, telefone, endereco, email) {
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.email = email;
    };

    static async pegarCliente(req, res) {
        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

        try {
            const cliente = await collectionClientes.findOne({ _id: ObjectId(req.params.id) });

            res.status(200).json(cliente);
        } catch (err) {
            res.status(400).json("Erro no carregamento das informações.");
        };
    };

    static async excluirCliente(req, res) {
        try {
            const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

            console.log(collectionClientes);

            const clienteExcluido = await collectionClientes.deleteOne({ _id: ObjectId(req.params.id) });

            res.status(400).json(clienteExcluido); 

        } catch (err) {
            res.status(400).json("Erro.")
        }
    };

    static async editarCliente(req, res) {

        const {
            nome, 
            endereco,
            email,
            telefone,
            cpf,
            cnpj,
            sigla
        } = req.body;

        try {
            const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

            const documentoCliente = await collectionClientes.findOne({ _id: ObjectId(req.params.id) });

            let documentoAtualizado;

            if(documentoCliente.cpf !== undefined)
                documentoAtualizado = collectionClientes.updateOne(documentoCliente, { $set: { nome, endereco, email, telefone, "cpf": cpf }});

            if(documentoCliente.cnpj !== undefined)
                documentoAtualizado = collectionClientes.updateOne(documentoCliente, { $set: { nome, endereco, email, telefone, "cnpj": cnpj }});

            if(documentoCliente.sigla !== undefined)
                documentoAtualizado = collectionClientes.updateOne(documentoCliente, { $set: { nome, endereco, email, telefone, "sigla": sigla }});

            res.status(200).json(documentoAtualizado);
        } catch (err) {
            res.status(400).json('Erro ao atualizar as informações.');
        }
    };

    static async excluirCliente(req, res) {
        try {
            
            const collectionPedidos = await funcoesBancoDados.conectarBancoDados('pedidos')

            const pedidosCliente = await collectionPedidos.findOne({ idCliente: req.params.id, statusPedido: "EM_SEPARACAO" });
            
            if(pedidosCliente)
                return res.status(400).json('Não é possível realizar a exclusão. O cliente possui pedidos em aberto.');

            const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');
            const documentoCliente = await collectionClientes.findOne({ _id: ObjectId(req.params.id) });
            
            if(!documentoCliente)
                return res.status(404).json('Cliente inexistente.');

            await collectionClientes.deleteOne({ "_id": ObjectId(req.params.id) });

            return res.status(400).json("Cliente excluído com sucesso!");
        } catch (err) {
            return res.status(400).json("Erro na exclusão do cliente");
        }
    };
    
};

class PessoaFisica extends Cliente {
    constructor(nome, telefone, endereco, email, cpf) {
        super(nome, telefone, endereco, email)
        this.cpf = cpf;
    }

    static async cadastrarCliente(req, res) {

        const {
            nome,
            telefone,
            endereco,
            email,
            cpf,
        } = req.body;

        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

        let clienteExiste = await collectionClientes.findOne({ cpf });

        if(clienteExiste)
            return res.status(400).json('Cliente já existente!');

        let novoCliente = new PessoaFisica(nome, telefone, endereco, email, cpf)

        await collectionClientes.insertOne(novoCliente);

        console.log(novoCliente);
        res.status(200).json(novoCliente);

    };
};

class PessoaJuridica extends Cliente {
    constructor(nome, telefone, endereco, email, cnpj) {
        super(nome, telefone, endereco, email);
        this.cnpj = cnpj;
    };

    static async cadastrarCliente(req, res) {

        const {
            nome,
            telefone,
            endereco,
            email,
            cnpj,
        } = req.body;

        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

        let clienteExiste = await collectionClientes.findOne({ cnpj });

        if(clienteExiste)
            return res.status(400).json('Cliente já existente!');

        let novoCliente = new PessoaJuridica(nome, telefone, endereco, email, cnpj)

        await collectionClientes.insertOne(novoCliente);

        console.log(novoCliente);
        res.status(200).json(novoCliente);

    };
};

class OrgaoPublico extends Cliente {
    constructor(nome, telefone, endereco, email, sigla) {
        super(nome, telefone, endereco, email);
        this.sigla = sigla;
    };

    static async cadastrarCliente(req, res) {

        const {
            nome,
            telefone,
            endereco,
            email,
            sigla,
        } = req.body;

        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');

        let clienteExiste = await collectionClientes.findOne({ sigla });

        if(clienteExiste)
            return res.status(400).json('Cliente já existente!');

        let novoCliente = new OrgaoPublico(nome, telefone, endereco, email, sigla)

        await collectionClientes.insertOne(novoCliente);

        console.log(novoCliente);
        res.status(200).json(novoCliente);

    };
};

async function listarClientes(req, res) {
    try {
        const collectionClientes = await funcoesBancoDados.conectarBancoDados('clientes');
        const clientes = await collectionClientes.find({}).toArray();

        res.status(200).json(clientes);
    } catch (err) {
        console.log(err);
        res.status(400).json("Erro no carregamento das informações.");
    };
};

module.exports = { Cliente, listarClientes, PessoaFisica, PessoaJuridica, OrgaoPublico };