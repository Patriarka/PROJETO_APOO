const StatusPedido = {
    EMSEPARACAO = 'emSeparacao',
    devolvido = 'devolvido',
    entregue = 'entregue'
}

class Pedido{
    
    constructor(formaPagamento, endereco, dataPedido){
        this.formaPagamento = formaPagamento;
        this.endereco = endereco;
        this.dataPedido = dataPedido;
    }

    // Aqui precisamos cadastrar os nossos pedidos

};

class Entrega{

    constructor(){
        // Fazer uma função ou fazer a verificação do status aqui no constructor com um switch case
    }

}

module.exports = Pedido;