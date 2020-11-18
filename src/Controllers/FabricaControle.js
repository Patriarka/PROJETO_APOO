const bd = require("../bancoDados.js");

class Fabrica {

    constructor(nome, email){
        this.nome = nome;
        this.email = email;
    };

    static async novaFabrica(req, res){

        try {
            const collectionFabricas = await bd.conectarBancoDados('fabricas');

            const {
                nome, 
                email
            } = req.body;

            let novaFabrica = new Fabrica(nome, email);

            await collectionFabricas.insertOne(novaFabrica);

            return res.status(200).json(novaFabrica); 
            
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao cadastrar a Fábrica');
        };
    };
    
};

async function listarFabricas(req, res) {
    try {
        const collectionFabricas = await bd.conectarBancoDados('fabricas');
        const fabricas = await collectionFabricas.find({}).toArray();

        return res.status(200).json(fabricas);
    } catch (err) {
        return res.status(400).json("Erro no carregamento das informações.");
    };
};

module.exports = { Fabrica, listarFabricas };
