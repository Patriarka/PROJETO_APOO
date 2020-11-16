const { ObjectId } = require("mongodb");
const funcoesBancoDados = require("../bancoDados.js");

var statusPedido = {
    EM_SEPARACAO: 0,
    DEVOLVIDO: 1,
    ENTREGUE: 2
};

class Pedido {

    static STATUS_PEDIDO = statusPedido;

    constructor(formaPagamento, endereco, dataPedido, statusPedido, idCliente) {
        this.formaPagamento = formaPagamento;
        this.endereco = endereco;
        this.dataPedido = dataPedido;
        this.STATUS_PEDIDO = statusPedido;
        this.idCliente = idCliente;
    };

    static async novoPedido(req, res) {
        try {

            const collectionPedidos = await funcoesBancoDados.conectarBancoDados('pedidos');

            let novoPedido = new Pedido(req.body.formaPagamento, req.body.endereco, req.body.dataPedido, req.body.statusPedido, req.body.idCliente);

            await collectionPedidos.insertOne(novoPedido);

            return res.status(200).json(novoPedido);
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao cadastrar o pedido');
        };
    };

    static async listarPedido(req, res) {
        try {

            const collectionPedidos = await funcoesBancoDados.conectarBancoDados('pedidos');
            const pedido = await collectionPedidos.findOne({ _id: ObjectId(req.params.id) });

            return res.status(200).json(pedido);
        } catch (err) {
            return res.status(400).json("Erro no carregamento das informações.");
        };
    };

    static async excluirPedido(req, res) {
        try {
            const collectionPedidos = funcoesBancoDados.conectarBancoDados('pedidos');
            // verificar se o pedido está em aberto
            const pedido = (await collectionPedidos).findOne({ _id: ObjectId(req.params.id) });

            if (pedido.statusPedido !== ENTREGUE)
                return res.status(400).json('Não é possível excluir um pedido em aberto.');

            const pedidoExcluido = await collectionPedidos.deleteOne({ _id: ObjectId(req.params.id) });

            return res.status(400).json(pedidoExcluido);
        } catch (err) {
            return res.status(400).json("Erro.")
        }
    };

    static async editarPedido(req, res) {
        try {
            const collectionPedidos = await funcoesBancoDados.conectarBancoDados('pedidos');

            const documentoPedido = await collectionPedidos.findOne({ _id: ObjectId(req.params.id) });

            if (!documentoPedido)
                return res.status(400).json('Pedido não existe.');

            // pode atualizar o tipo de documento ? 
            let documentoAtualizado = await collectionPedidos.updateOne(documentoPedido, { $set: { nome: req.body.nome, endereco: req.body.endereco, email: req.body.email, telefone: req.body.telefone, [req.body.tipoDocumento]: [req.body.documento] } });

            return res.status(200).json(documentoAtualizado);
        } catch (err) {
            return res.status(400).json('Erro ao atualizar as informações.');
        }
    };

};

async function listarTodosPedidos(req, res) {
    try {
        const collectionPedidos = funcoesBancoDados.conectarBancoDados('pedidos');
        const pedidos = await collectionPedidos.find({}).toArray();

        return res.status(200).json(pedidos);
    } catch (err) {
        return res.status(400).json("Erro no carregamento das informações.");
    };
};

module.exports = { Pedido, listarTodosPedidos };