const { Fabrica } = require('../Models/Fabrica');
const bd = require("../bancoDados.js");

module.exports = {
    async NovaFabrica(req, res){
        try {

            const collectionFabricas = await bd.conectarBancoDados('fabricas');

            let novaFabrica = new Fabrica(req.body);

            await collectionFabricas.insertOne(novaFabrica);

            return res.status(200).json(novaFabrica); 
            
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao cadastrar a Fábrica');
        };
    },

    async ListarFabricas(req, res){
        try {
            const collectionFabricas = await bd.conectarBancoDados('fabricas');
            
            const fabricas = await collectionFabricas.find({}).toArray();
    
            return res.status(200).json(fabricas);
        } catch (err) {
            return res.status(400).json("Erro no carregamento das informações!");
        };
    }
}