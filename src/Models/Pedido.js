class PedidoEmpresa {
    constructor({formaPagamento, statusPedido, endereco, dataPedido, listaProdutos, idFabrica}){
        this.formaPagamento = formaPagamento,
        this.statusPedido = statusPedido,
        this.endereco = endereco,
        this.dataPedido = dataPedido,
        this.listaProdutos = listaProdutos,
        this.idFabrica = idFabrica
    };
};

class PedidoCliente extends PedidoEmpresa {
    constructor(dados){
        super(dados);
        this.idCliente = dados.idCliente;
    }
};

module.exports = { PedidoEmpresa, PedidoCliente };