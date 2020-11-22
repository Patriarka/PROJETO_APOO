const { MongoClient } = require('mongodb');

async function conectarBancoDados(collectionNome) {
    
    const client = await MongoClient.connect('mongodb+srv://patriarca:patriarca@cluster0.jyc97.mongodb.net/patriarca_tapetes?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    
    const db = client.db('patriarca_tapetes');
    const collection = db.collection(collectionNome);
    
    return collection;
};

module.exports = { conectarBancoDados };