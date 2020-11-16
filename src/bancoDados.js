const { MongoClient } = require('mongodb');

async function conectarBancoDados(collectionName) {
    const client = await MongoClient.connect('mongodb+srv://patriarca:patriarca@cluster0.jyc97.mongodb.net/patriarca_tapetes?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('patriarca_tapetes');
    const collection = db.collection(collectionName);
    return collection;
};

module.exports = { conectarBancoDados };