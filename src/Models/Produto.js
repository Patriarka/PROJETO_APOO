class Produto {
    constructor({tipo, tamanho, precoCompra, precoVenda, img, cor, corLetras, qtde}) {
        this.tipo = tipo;
        this.tamanho = tamanho;
        this.precoCompra = precoCompra;
        this.precoVenda = precoVenda;
        this.img = img;
        this.cor = cor;
        this.corLetras = corLetras;
        this.qtde = qtde;
    };
};

class Tapete extends Produto {
    constructor(dados){
        super(dados);
        this.temBordaInterna = dados.temBordaInterna;
        this.temBordaRebaixada = dados.temBordaRebaixada;
    };
};

class Bandeira extends Produto {
    constructor(dados){
        super(dados);
        this.temPersonalizacaoDupla = dados.temPersonalizacaoDupla;
    };
};

module.exports = { Tapete, Bandeira };