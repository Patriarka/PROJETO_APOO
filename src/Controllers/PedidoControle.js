const { ObjectId } = require("mongodb");

const bd = require("../bancoDados.js");

var TodosStatusPedido = {
    EM_SEPARACAO: 'EM_SEPARACAO',
    DEVOLVIDO: 'DEVOLVIDO',
    ENTREGUE: 'ENTREGUE'
};

var TodasFormasPagamento = {
    DINHEIRO: 'DINHEIRO',
    CARTAO: 'CARTAO',
    BOLETO: 'BOLETO'
};

class Pedido {

    static encontrarStatus(status) {
        switch (status) {
            case 0: {
                return TodosStatusPedido.EM_SEPARACAO;
            }
            case 1: {
                return TodosStatusPedido.DEVOLVIDO;
            }
            case 2: {
                return TodosStatusPedido.ENTREGUE;
            }
            default: {
                return -1;
            }
        };
    };

    static encontrarPagamento(pagamento) {
        switch (pagamento) {
            case 0:
                return TodasFormasPagamento.DINHEIRO
            case 1:
                return TodasFormasPagamento.CARTAO;
            case 2:
                return TodasFormasPagamento.BOLETO;
            default:
                return -1;
        };
    };

    constructor(formaPagamento, endereco, dataPedido, statusPedido, idCliente) {
        this.formaPagamento = Pedido.encontrarPagamento(formaPagamento);
        this.statusPedido = Pedido.encontrarStatus(statusPedido);
        this.endereco = endereco;
        this.dataPedido = dataPedido;
        this.idCliente = idCliente;
    };

    static async novoPedido(req, res) {
        try {
            const collectionPedidos = await bd.conectarBancoDados('pedidos');

            const dataPedido = new Date();
        
            let novoPedido = new Pedido(req.body.formaPagamento, req.body.endereco, dataPedido, req.body.statusPedido, req.body.idCliente);

            if(novoPedido.statusPedido === -1 || novoPedido.formaPagamento === -1) return res.status(400).json('Status do pedido ou do pagamento inválido.');

            await collectionPedidos.insertOne(novoPedido);

            return res.status(200).json(novoPedido); 
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao cadastrar o pedido');
        };
    };

    static async pegarPedido(req, res) {
        try {
            const collectionPedidos = await bd.conectarBancoDados('pedidos');
            const pedido = await collectionPedidos.findOne({ "_id": ObjectId(req.params.id) });
            
            if(!pedido)
                return res.status(404).json('Pedido não encontrado.');

            res.status(200).json(pedido);
        } catch (err) {
            console.log(err);
            res.status(400).json('Erro no carregamento das informações');
        };
    };
    
    static async excluirPedido(req, res) {
        try {
            const collectionPedidos = await bd.conectarBancoDados('pedidos');
            const pedido = await collectionPedidos.findOne({ _id: ObjectId(req.params.id) });

            if(!pedido)
                res.status(404).json('Pedido não encontrado.');
            
            const diferencaTempo = Math.abs(Date.getTime() - pedido.statusPedido.getTime());
            const diferencaDataPedido = Math.ceil(diferencaTempo / (1000 * 3600 * 24)); 
            
            if (pedido.statusPedido === EM_SEPARACAO || diferencaDataPedido <= 30)
                return res.status(400).json('Não é possível excluir um pedido em aberto.');

            const pedidoExcluido = await collectionPedidos.deleteOne({ _id: ObjectId(req.params.id) });

            return res.status(400).json(pedidoExcluido);
        } catch (err) {
            return res.status(400).json("Erro ao excluir pedido.")
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