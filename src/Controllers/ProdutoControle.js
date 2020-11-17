const funcoesBancoDados = require("../bancoDados.js");

const collectionProdutos = funcoesBancoDados.conectarBancoDados('produtos');

var statusProduto = {
    EM_FABRICACAO: 0,
    DISPONIVEL: 1,
    INDISPONIVEL: 2
};

class Produto {

    static STATUS_PRODUTO = statusProduto;

    constructor(idPedidoFabrica, idPedidoCliente, tipo, tamanho, qtde, precoCompra, precoVenda, dataFabricacao, img, cor, corLetras, statusProduto) {
        this.idPedidoFabrica = idPedidoFabrica;
        this.idPedidoCliente = idPedidoCliente;
        this.tipo = tipo;
        this.tamanho = tamanho;
        this.precoCompra = precoCompra;
        this.precoVenda = precoVenda;
        this.img = img;
        this.cor = cor;
        this.corLetras = corLetras;
        
        // verificarEstoque()
        // Se o produto já estiver cadastrado no "estoque". não executar a fabricação 
        // StatusProduto = DISPONIVEL
        // Pegar as características de um produto anteriormente "pronto"

        this.dataFabricacao = dataFabricacao;
        this.qtde = qtde;
        this.statusProduto = statusProduto;
    };

    static async novoProduto(req, res) {
        try {
            
            const collectionProdutos = await funcoesBancoDados.conectarBancoDados('produtos');

            let novoProduto;

            if(req.body.tipo === 'bandeira')
                novoProduto = new Bandeira(req.body.idPedidoFabrica, req.body.tipo, req.body.tamanho, req.body.qtde, req.body.precoCompra, req.body.precoVenda, req.body.dataFabricacao, req.body.img, req.body.cor, req.body.corLetras, req.body.statusProduto, req.body.temPersonalizacaoDupla);

            else if(req.body.tipo === 'tapete')
                novoProduto = new Tapete(req.body.idPedidoFabrica, req.body.tipo, req.body.tamanho, req.body.qtde, req.body.precoCompra, req.body.precoVenda, req.body.dataFabricacao, req.body.img, req.body.cor, req.body.corLetras, req.body.statusProduto, req.body.temBordaInterna, req.body.temBordaInterna);
        
            const compararProduto = (({ idPedidoFabrica, qtde, dataFabricacao, precoCompra, precoVenda, statusProduto, ...produto }) => produto)(novoProduto);
            
            const produtoExiste = await collectionProdutos.findOne(compararProduto);

            if (produtoExiste){
                await collectionProdutos.updateOne(produtoExiste, { $inc: { qtde: -1 } });
                return res.status(200).json('Produto atualizado.');
            };

            // enviar email com produtos não existentes para a fabrica
            
            await collectionProdutos.insertOne(novoProduto);

            return res.status(200).json(novoProduto);

        } catch (err) {
            return res.status(400).json('Erro ao cadastrar o produto');
        };
    };

    static async editarProduto(req, res) {

    };

    static async apagarProduto(req, res) {

    };

    static async filtrarProduto(req, res) {

    };

};

class Tapete extends Produto {

    constructor(temBordaInterna) {
        this.temBordaInterna = temBordaInterna;
        this.temBordaRebaixada = temBordaRebaixada;
    }

    static async novoProduto(req, res) {

        let novoProduto = {};

        const produtoExiste = (await collectionProdutos).findOne({ tipo: tipo, tamanho: tamanho, precoCompra: precoCompra, precoVenda: precoVenda, img: img, cor: cor, corLetras: corLetras });
        
        if(produtoExiste)
            (await collectionProdutos).updateOne({ $inc: { qtde: 1 } });
        
        novoProduto = new Bandeira(req.body.nome, req.body.telefone, req.body.endereco, req.body.email, req.body.documento);

        await collectionProdutos.insertOne(novoProduto);

        res.status(200).json(novoProduto);
    };
};

class Bandeira extends Produto {

    constructor(temPersonalizacaoDupla) {
        this.temPersonalizacaoDupla = temPersonalizacaoDupla;
    }

    static async novoProduto(req, res) {

        let novoProduto = {};

        const produtoExiste = (await collectionProdutos).findOne({ tipo: tipo, tamanho: tamanho, precoCompra: precoCompra, precoVenda: precoVenda, img: img, cor: cor, corLetras: corLetras });
        
        if(produtoExiste)
            (await collectionProdutos).updateOne({ $inc: { qtde: 1 } });
        
        novoProduto = new Bandeira(req.body.nome, req.body.telefone, req.body.endereco, req.body.email, req.body.documento);

        await collectionProdutos.insertOne(novoProduto);

        res.status(200).json(novoProduto);
    };
};

async function listarTodosProdutos(req, res) {
    try {
        const produtos = await collectionProdutos.find({}).toArray();
        res.status(200).json(produtos);
    } catch (err) {
        res.status(400).json("Erro no carregamento das informações.");
    };
};

module.exports = Produto;