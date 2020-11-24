const { Fabrica } = require('../Models/Fabrica');
const { ObjectId } = require('mongodb');
const bd = require("../bancoDados.js");

module.exports = {
    async cadastrarFabrica(req, res){
        try {

            const collectionFabricas = await bd.conectarBancoDados('fabricas');

            let novaFabrica = new Fabrica(req.body);

            await collectionFabricas.insertOne(novaFabrica);

            return res.status(200).json(novaFabrica); 
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao cadastrar a fábrica.');
        };
    },

    async listarFabricas(req, res){
        try {
 
            const collectionFabricas = await bd.conectarBancoDados('fabricas');

            const fabricas = await collectionFabricas.find({}).toArray();

            return res.status(200).json(fabricas);
        } catch (err) {
            console.log(err);
            return res.status(400).json("Erro no carregamento das informações das fábricas.");
        };
    },

    async listarFabrica(req, res){
        try {
            
            const collectionFabricas = await bd.conectarBancoDados('fabricas');
            
            const fabricas = await collectionFabricas.findOne({ _id: ObjectId(req.params.id) });
    
            return res.status(200).json(fabricas);
        } catch (err) {
            console.log(err);
            return res.status(400).json("Erro no carregamento das informações da fábrica.");
        };
    },

    async excluirFabrica(req, res){
        try{

            const collectionFabricas = await bd.conectarBancoDados('fabricas');
            
            const fabrica = await collectionFabricas.findOne({ _id: ObjectId(req.params.id) });

            if(!fabrica)
                return res.status(404).json('Fábrica não encontrada!');

            await collectionFabricas.deleteOne({ _id: ObjectId(req.params.id) });

            return res.status(200).json('Fábrica excluída com sucesso.');
        } catch(err){
            console.log(err);
            return res.status(400).json("Erro ao excluir a fábrica.");
        }
    },

    async editarFabrica(req, res){
        try{

            const novosDados = req.body;

            const collectionFabricas = await bd.conectarBancoDados('fabricas');

            const documentoFabrica = await collectionFabricas.findOne({ _id: ObjectId(req.params.id) });
        
            await collectionFabricas.updateOne(documentoFabrica, { $set: novosDados });

            return res.status(200).json("Fábrica alterada com sucesso.");
        } catch(err) {
            console.log(err);
            return res.status(400).json("Erro ao editar a fábrica.");
        }
    }
}