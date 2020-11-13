// const { response, request } = require("express");
// const { request } = require('express');
const { MongoClient } = require('mongodb');

module.exports = class Cliente{

    constructor(nome, telefone, endereco, email) {
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.email = email;
    };

    cadastrarCliente(req, res){
 
        const {
            nome,
            telefone,
            endereco,
            email,
            cpf,
            cnpj,
            sigla
        } = req.body;
   
        // let novoCliente, clienteExiste; 
   
       /*  await new MongoClient.connect('mongodb+srv://patriarca:patriarca@cluster0.jyc97.mongodb.net/patriarca_tapetes?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, async function (err, client) {
   
            let database = client.db('patriarca_tapetes');
   
            if (cpf !== undefined) {
   
                database.collection('clientes').findOne({ cpf: cpf }, async function (err, response) {
                    clienteExiste = response;
                    client.close();
                    if(clienteExiste !== null) return res.json({ msg: "cliente existente" });
                });
   
                novoCliente = new Pessoa_Fisica(nome, telefone, endereco, email, cpf);
   
            } else if (cnpj !== undefined) {
   
                database.collection('clientes').findOne({ cnpj: cnpj }, async function (err, response) {
                    clienteExiste = response;
                    client.close();
                    if(clienteExiste !== null) return res.json({ msg: "cliente existente" });
                });
   
                novoCliente = new Pessoa_Juridica(nome, telefone, endereco, email, cnpj);
           
            } else if (sigla !== undefined) {
   
                database.collection('clientes').findOne({ sigla: sigla }, async function (err, response) {
                    clienteExiste = response;
                    client.close();
                    if(clienteExiste !== null) return res.json({ msg: "cliente existente" });
                });
   
                novoCliente = new Orgao_Publico(nome, telefone, endereco, email, sigla);
   
            }
   
        });
   
        if(clienteExiste !== undefined) return res.json({ msg: "cliente existente" });  */
    
        /* MongoClient.connect('mongodb+srv://patriarca:patriarca@cluster0.jyc97.mongodb.net/patriarca_tapetes?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
          
            if (err) console.log(err);
    
            var database = db.db("patriarca_tapetes");
    
            database.collection("clientes").insertOne(novoCliente, function (err, response) {
               console.log("1 cliente inserido");
               db.close();
               res.json(novoCliente);
            });
   
        });  */
   
    }

};

