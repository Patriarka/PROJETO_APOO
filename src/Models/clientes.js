const mongoose = require('mongoose');

const ClienteSchema = mongoose.Schema({
    nome: { type: String, required: true },
    telefone: { type: String, required: true },
    endereco: { type: String, required: true},
    email: { type: String, required: true },
    cpf: { type: String, required: false },
    cnpj: { type: String, required: false },
    sigla: { type: String, required: false }
});

/*
class Cliente {

    constructor(nome, telefone, endereco, email) {
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.email = email;
    };

    getCliente() {
        console.log('lista');
    }

    // removerCliente(){}

    // alterarCliente(){};

    // filtrarCliente(){}

};

class Pessoa_Fisica extends Cliente {

    constructor(nome, telefone, endereco, email, cpf) {
        super(nome, telefone, endereco, email)
        this.cpf = cpf;
    }
};

class Pessoa_Juridica extends Cliente {

    constructor(nome, telefone, endereco, email, cnpj) {
        super(nome, telefone, endereco, email);
        this.cnpj = cnpj;
    };

};

class Orgao_Publico extends Cliente {

    constructor(nome, telefone, endereco, email, sigla) {
        super(nome, telefone, endereco, email);
        this.sigla = sigla;rs

    };

}; 
*/

module.exports = mongoose.model('clientes', ClienteSchema);