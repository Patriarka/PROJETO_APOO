const { Tapete, Bandeira } = require('../Models/Produto');
const { ObjectId } = require('mongodb');
const bd = require("../bancoDados.js");

var Tipo = {
    SANITIZANTE: 'SANITIZANTE',
    PINTADO: 'PINTADO',
    VULCANIZADO: 'VULCANIZADO',
    LISO: 'LISO',
    FLAG_BANNER: 'FLAG_BANNER'
};

function tipoProduto(tipoProduto) {
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

module.exports = {
    async cadastrarProduto(req, res){
        try {

            let tipo = tipoProduto(req.body.tipo) 

            if(tipo === -1) return res.status(404).json('Tipo inválido!');

            const collectionProdutos = await bd.conectarBancoDados('produtos');
        
            let novoProduto;

            if(req.body.produtoEspecificado === 'bandeira') novoProduto = new Bandeira(req.body);
            else if (req.body.produtoEspecificado === 'tapete') novoProduto = new Tapete(req.body);

            novoProduto.qtde = 0;

            const compararProduto = (({ idPedidoFabrica, qtde, precoCompra, precoVenda, ...produto }) => produto)(novoProduto);

            const produtoExiste = await collectionProdutos.findOne(compararProduto);

            if (produtoExiste)
                return res.status(400).json('Produto já cadastrado.');
            
            await collectionProdutos.insertOne(novoProduto);

            return res.status(200).json(novoProduto);  
            
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao cadastrar o produto');
        };
    },

    async excluirProduto(req, res){
        try {
            if(ObjectId.isValid(req.params.id) === false)
                return res.status(400).json('ID inválido.'); 

            const collectionProdutos = await bd.conectarBancoDados('produtos');

            const produto = await collectionProdutos.findOne({ _id: ObjectId(req.params.id) });
            
            if(produto.qtde > 0)
                return res.status(400).json('Não é possível realizar a exclusão.');

            await collectionProdutos.deleteOne({ "_id": ObjectId(req.params.id) });

            return res.status(400).json("Produto excluído com sucesso!");
        } catch (err) {
            console.log(err);
            return res.status(400).json("Erro na exclusão do produto.");
        }
    },

    async listarProdutos(req, res){
        try {
            const collectionProdutos = await bd.conectarBancoDados('produtos');

            const produtos = await collectionProdutos.find({}).toArray();
            
            return res.status(200).json(produtos);
        } catch (err) {
            console.log(err);
            return res.status(400).json("Erro no carregamento das informações!");
        };
    },

    async listarProduto(req, res){
        try {
            const collectionProdutos = await bd.conectarBancoDados('produtos');

            const produto = await collectionProdutos.findOne({_id: req.params.idProduto });
            
            return res.status(200).json(produto);
        } catch (err) {
            console.log(err);
            return res.status(400).json("Erro no carregamento das informações!");
        };
    }
}