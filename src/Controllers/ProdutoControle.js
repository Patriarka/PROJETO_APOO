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

            let produtoEspecifico = {};

            if (req.body.temBordaInterna)
                produtoEspecifico = {
                    temBordaInterna,
                    temBordaRebaixada
                } = req.body;
            else if (req.body.temPersonalizacaoDupla)
                produtoEspecifico = {
                    temPersonalizacaoDupla
                } = req.body;

            const produtoExiste = (await collectionProdutos).find({
                tipo: req.body.tipo,
                tamanho: req.body.tamanho,
                precoCompra: req.body.precoCompra,
                precoVenda: req.body.precoVenda,
                img: req.body.img,
                cor: req.body.cor,
                corLetras: req.body.corLetras
            });

            if (produtoExiste)
                (await collectionProdutos).updateOne({ $inc: { qtde: 1 } });

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

        if (produtoExiste)
            (await collectionProdutos).updateOne({ $inc: { qtde: 1 } });

        novoProduto = new Bandeira(req.body.nome, req.body.telefone, req.body.endereco, req.body.email, req.body.documento);

        await collectionProdutos.insertOne(novoProduto);

        return res.status(200).json(novoProduto);
    };
};

class Bandeira extends Produto {

    constructor(temPersonalizacaoDupla) {
        this.temPersonalizacaoDupla = temPersonalizacaoDupla;
    }

    static async novoProduto(req, res) {

        let novoProduto = {};

        const produtoExiste = (await collectionProdutos).findOne({ tipo: tipo, tamanho: tamanho, precoCompra: precoCompra, precoVenda: precoVenda, img: img, cor: cor, corLetras: corLetras });

        if (produtoExiste)
            (await collectionProdutos).updateOne({ $inc: { qtde: 1 } });

        novoProduto = new Bandeira(req.body.nome, req.body.telefone, req.body.endereco, req.body.email, req.body.documento);

        await collectionProdutos.insertOne(novoProduto);

        return res.status(200).json(novoProduto);
    };
};

async function listarTodosProdutos(req, res) {
    try {
        const produtos = await collectionProdutos.find({}).toArray();
        return res.status(200).json(produtos);
    } catch (err) {
        return res.status(400).json("Erro no carregamento das informações.");
    };
};

module.exports = { Produto, listarTodosProdutos };