const StatusProduto = {
    EMFABRICACAO: 'emFabricacao',
    DISPONIVEL: 'disponivel',
    INDISPONIVEL: 'indisponivel'
}

class Produto{
    
    constructor(tipo, tamanho, qtde, precoCompra, precoVenda, dataFabricacao, img, cor, corLetras, statusProduto){
        this.tipo = tipo;
        this.tamanho = tamanho;
        this.qtde = qtde;
        this.precoCompra = precoCompra;
        this.precoVenda = precoVenda;
        this.dataFabricacao = dataFabricacao;
        this.img = img;
        this.cor = cor;
        this.corLetras = corLetras;
        this.statusProduto = statusProduto;
    }

};


class Tapete{
    
    constructor(temPersonalizacaoDupla){
        this.temPersonalizacaoDupla = temPersonalizacaoDupla;
    }

};

class Bandeira{
    
    constructor(temBordaInterna){
        this.temBordaInterna = temBordaInterna;
        this.temBordaRebaixada = temBordaRebaixada;
    }

};

module.exports = Produto;