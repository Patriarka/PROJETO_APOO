const mongoose = require('mongoose');
const { Cliente } = require('../Models/Cliente');

class PessoaFisica extends Cliente {
    constructor(){
        super({
            nome: String,
            telefone: String,
            endereco: String,
            email: String,
            cpf: String
        })
    }
};

const schema = new PessoaFisica();
module.exports = mongoose.model('clientes', schema);