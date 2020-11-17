const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require("mongodb");

const bd = require("../bancoDados.js");

var StatusPedido = {
    EM_SEPARACAO: 0,
    DEVOLVIDO: 1,
    ENTREGUE: 2
};

var FormaPagamento = {
    DINHEIRO: 0,
    CARTAO: 1,
    BOLETO: 2
}

class Pedido {

    constructor(FormaPagamento, endereco, dataPedido, StatusPedido, idCliente) {
        this.formaPagamento = FormaPagamento;
        this.endereco = endereco;
        this.dataPedido = dataPedido;
        this.StatusPedido = StatusPedido;
        this.idCliente = idCliente;
    };

    static async novoPedido(req, res) {
        try {
            let novoPedido = new Pedido(req.body.formaPagamento, req.body.endereco, req.body.dataPedido, req.body.StatusPedido, req.body.idCliente);
            const collectionPedidos = await bd.conectarBancoDados('pedidos');

            await collectionPedidos.insertOne(novoPedido);

            res.status(200).json(novoPedido);
        } catch (err) {
            console.log(err);
            res.status(400).json('Erro ao cadastrar o pedido');
        };
    };

    static async pegarPedido(req, res) {
        try {
            const collectionPedidos = await bd.conectarBancoDados('pedidos');
            const pedido = await collectionPedidos.findOne({ "_id": ObjectId(req.params.id) });
            
            res.status(200).json(pedido);
        } catch (err) {
            console.log(err);
            res.status(400).json('Erro no carregamento das informações');
        };
    };
    
    static async excluirPedido(req, res) {
        try {
            const collectionPedidos = await bd.conectarBancoDados('pedidos');
            const pedido = await collectionPedidos.findOne({ "_id": ObjectId(req.params.id) });

            if (pedido.StatusPedido !== 'ENTREGUE')
                return res.status(400).json('Não é possível excluir um pedido em aberto!');

            await collectionPedidos.deleteOne({ "_id": ObjectId(req.params.id) });

            return res.status(400).json("Pedido Excluído com sucesso!");
        } catch (err) {
            return res.status(400).json("Erro na exclusão do pedido");
        }
    };
   
    static async editarPedido(req, res) {
        try {
            const {
                formaPagamento,
                endereco,
                dataPedido,
                StatusPedido,
                idCliente
            } = req.body;

            const collectionPedidos = await bd.conectarBancoDados('pedidos');

            const pedido = await collectionPedidos.findOne({ "_id": ObjectId(req.params.id) });
            
            if (!pedido)
                return res.status(400).json('Pedido não existe!');

            await collectionPedidos.updateOne(pedido, { $set: { formaPagamento, endereco, dataPedido, StatusPedido, idCliente } } );

            return res.status(200).json(pedido);
        } catch (err) {
            return res.status(400).json('Erro ao atualizar as informações.');
        }
    };

};

async function listarTodosPedidos(req, res) {
    try {
        const collectionPedidos = await bd.conectarBancoDados('pedidos');
        const pedidos = await collectionPedidos.find({}).toArray();

        return res.status(200).json(pedidos);
    } catch (err) {
        return res.status(400).json("Erro no carregamento das informações.");
    };
};

module.exports = { Pedido, listarTodosPedidos };