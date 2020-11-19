const funcoesBancoDados = require("../bancoDados.js");

var Tipo = {
    SANITIZANTE: 'SANITIZANTE',
    PINTADO: 'PINTADO',
    VULCANIZADO: 'VULCANIZADO',
    LISO: 'LISO',
    FLAG_BANNER: 'FLAG_BANNER'
};

class Produto {

    static TipoProduto(tipoProduto) {
        switch (tipoProduto) {
            case 0:
                return Tipo.SANITIZANTE;
            case 1:
                return Tipo.PINTADO;
            case 2:
                return Tipo.VULCANIZADO;
            case 3:
                return Tipo.LISO;
            case 4:
                return Tipo.FLAG_BANNER;
            default:
                return -1;
        };
    };

    constructor(tipo, tamanho, qtde, precoCompra, precoVenda, img, cor, corLetras) {
        this.tipo = TipoProduto(tipo);
        this.tamanho = tamanho;
        this.precoCompra = precoCompra;
        this.precoVenda = precoVenda;
        this.img = img;
        this.cor = cor;
        this.corLetras = corLetras;
        this.qtde = qtde;
    };

    static async novoProduto(req, res) {
        try {
            const collectionProdutos = await funcoesBancoDados.conectarBancoDados('produtos');

            let novoProduto;

            if (req.body.produtoEspecificado === 'bandeira')
                novoProduto = new Bandeira(req.body.tipo, req.body.tamanho, req.body.qtde, req.body.precoCompra, req.body.precoVenda, req.body.dataFabricacao, req.body.img, req.body.cor, req.body.corLetras, req.body.statusProduto, req.body.temPersonalizacaoDupla);

            else if (req.body.produtoEspecificado === 'tapete')
                novoProduto = new Tapete(req.body.idPedidoFabrica, req.body.tipo, req.body.tamanho, req.body.qtde, req.body.precoCompra, req.body.precoVenda, req.body.dataFabricacao, req.body.img, req.body.cor, req.body.corLetras, req.body.statusProduto, req.body.temBordaInterna, req.body.temBordaInterna);

            const compararProduto = (({ idPedidoFabrica, qtde, dataFabricacao, precoCompra, precoVenda, statusProduto, ...produto }) => produto)(novoProduto);

            const produtoExiste = await collectionProdutos.findOne(compararProduto);

            if (produtoExiste)
                return res.status(400).json('Produto já cadastrado.');

            await collectionProdutos.insertOne(novoProduto);

            return res.status(200).json(novoProduto);
        } catch (err) {
            return res.status(400).json('Erro ao cadastrar o produto');
        };
    };

    static async apagarProduto(req, res) {
        const { id } = req.body;

        try {
            const collectionProdutos = await funcoesBancoDados.conectarBancoDados('produtos')

            const produto = await collectionProdutos.findOne({ id });
            
            if(produto.qtde > 0)
                return res.status(400).json('Não é possível realizar a exclusão.');

            await collectionProdutos.deleteOne({ "_id": ObjectId(id) });

            return res.status(400).json("Produto excluído com sucesso!");
        } catch (err) {
            return res.status(400).json("Erro na exclusão do produto");
        }
    };
    
};

class Tapete extends Produto {

    constructor(tipo, tamanho, qtde, precoCompra, precoVenda, img, cor, corLetras, temBordaInterna, temBordaRebaixada) {
        super(tipo, tamanho, qtde, precoCompra, precoVenda, img, cor, corLetras);
        this.temBordaInterna = temBordaInterna;
        this.temBordaRebaixada = temBordaRebaixada;
    }

    static async novoProduto(req, res) {
        
        const collectionProdutos = await funcoesBancoDados.conectarBancoDados('produtos');

        const produtoExiste = await collectionProdutos.findOne({ tipo: req.body.tipo, tamanho: req.body.tamanho, precoCompra: req.body.precoCompra, precoVenda: req.body.precoVenda, img: req.body.img, cor: req.body.cor, corLetras: req.body.corLetras });
        
        if (produtoExiste)
            await collectionProdutos.updateOne(produtoExiste, { $inc: { qtde: 1 } });
        
        let novoProduto = {};
        
        novoProduto = new Tapete(req.body.tipo, req.body.tamanho, 0, req.body.precoCompra, req.body.precoVenda, req.body.img, req.body.cor, req.body.corLetras, req.body.temBordaInterna, req.body.temBordaRebaixada);

        await collectionProdutos.insertOne(novoProduto);

        res.status(200).json(novoProduto);
    };

};

class Bandeira extends Produto {

    constructor(tipo, tamanho, qtde, precoCompra, precoVenda, img, cor, corLetras, temPersonalizacaoDupla) {
        super(tipo, tamanho, qtde, precoCompra, precoVenda, img, cor, corLetras, temPersonalizacaoDupla);
        this.temPersonalizacaoDupla = temPersonalizacaoDupla;
    }

    static async novoProduto(req, res) {
        
        const collectionProdutos = await funcoesBancoDados.conectarBancoDados('produtos');

        const produtoExiste = await collectionProdutos.findOne({ tipo: req.body.tipo, tamanho: req.body.tamanho, precoCompra: req.body.precoCompra, precoVenda: req.body.precoVenda, img: req.body.img, cor: req.body.cor, corLetras: req.body.corLetras });
        
        if (produtoExiste)
            await collectionProdutos.updateOne(produtoExiste, { $inc: { qtde: 1 } });
        
        let novoProduto = {};
        
        novoProduto = new Bandeira(req.body.tipo, req.body.tamanho, 0, req.body.precoCompra, req.body.precoVenda, req.body.img, req.body.cor, req.body.corLetras, req.body.temPersonalizacaoDupla);

        await collectionProdutos.insertOne(novoProduto);

        res.status(200).json(novoProduto);
    };

};

async function listarProdutos(req, res){
    try {
        const collectionProdutos = await funcoesBancoDados.conectarBancoDados('produtos');
        const produtos = await collectionProdutos.find({}).toArray();
        return res.status(200).json(produtos);
    } catch (err) {
        return res.status(400).json("Erro no carregamento das informações.");
    };
}

module.exports = { Produto, Tapete, Bandeira, listarProdutos }

