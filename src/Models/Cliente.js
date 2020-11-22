class Cliente {
    constructor({nome, telefone, endereco, email}){
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.email = email;
    };
};

class PessoaFisica extends Cliente {
    constructor(dados){
        super(dados);
        this.cpf = dados.documento;
    };
};

class PessoaJuridica extends Cliente {
    constructor(dados){
        super(dados);
        this.cnpj = dados.documento;
    };
};

class OrgaoPublico extends Cliente {
    constructor(dados){
        super(dados);
        this.sigla = dados.documento;
    };
};

module.exports = { PessoaFisica, PessoaJuridica, OrgaoPublico };