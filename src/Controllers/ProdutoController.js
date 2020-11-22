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

function TipoProduto(tipoProduto) {
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
    async NovoProduto(req, res){
        try {

            let tipo = TipoProduto(req.body.tipo) 

            if(tipo === -1) return res.status(404).json('Tipo inválido!');

            const collectionProdutos = await bd.conectarBancoDados('produtos');
        
            let novoProduto;

            if(req.body.produtoEspecificado === 'bandeira') novoProduto = new Bandeira(req.body);
            else if (req.body.produtoEspecificado === 'tapete') novoProduto = new Tapete(req.body);

            novoProduto.qtde = 0;

            console.log(novoProduto);

            const compararProduto = (({ idPedidoFabrica, qtde, precoCompra, precoVenda, ...produto }) => produto)(novoProduto);

            const produtoExiste = await collectionProdutos.findOne(compararProduto);

            if (produtoExiste)
                return res.status(400).json('Produto já cadastrado.');
            
            await collectionProdutos.insertOne(novoProduto);

            return res.status(200).json(novoProduto);  
            
        } catch (err) {
            return res.status(400).json('Erro ao cadastrar o produto');
        };
    },

    async ApagarProduto(req, res){

        if(ObjectId.isValid(req.params.id) === false)
            return res.status(400).json('ID inválido.');    

        try {
            const collectionProdutos = await bd.conectarBancoDados('produtos');

            const produto = await collectionProdutos.findOne({ _id: ObjectId(req.params.id) });

            console.log(req.params.id);
            console.log(produto);
            
            if(produto.qtde > 0)
                return res.status(400).json('Não é possível realizar a exclusão.');

            await collectionProdutos.deleteOne({ "_id": ObjectId(req.params.id) });

            return res.status(400).json("Produto excluído com sucesso!");
        } catch (err) {
            return res.status(400).json("Erro na exclusão do produto.");
        }
    },

    async ListarProdutos(req, res){
        try {
            const collectionProdutos = await bd.conectarBancoDados('produtos');

            const produtos = await collectionProdutos.find({}).toArray();
            
            return res.status(200).json(produtos);
        } catch (err) {
            return res.status(400).json("Erro no carregamento das informações!");
        };
    }
}