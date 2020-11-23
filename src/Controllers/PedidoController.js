const { PedidoEmpresa, PedidoCliente } = require('../Models/Pedido');
const { ObjectId } = require('mongodb');
const bd = require("../bancoDados.js");
const nodemailer = require("nodemailer");

var TodosStatusPedido = {
    EM_SEPARACAO: 'EM_SEPARACAO',
    DEVOLVIDO: 'DEVOLVIDO',
    ENTREGUE: 'ENTREGUE'
};

var TodasFormasPagamento = {
    DINHEIRO: 'DINHEIRO',
    CARTAO: 'CARTAO',
    BOLETO: 'BOLETO'
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    pool: true,
    auth: {
        user: 'villablumer@gmail.com',
        pass: 'yphawyy98teste',
        refreshToken: '1//04crZwXBujhtXCgYIARAAGAQSNwF-L9IrAtECJDQ-NWaSjLS-FgoqCnzVeQMA5WLKl6yG5AQx5INznYHT7yZhko1mClS44Y2IdYk',
        accessToken: 'ya29.A0AfH6SMDxc13CZBPt6yKPctMHhACesp6A9It-G3YhyjLWO38repUGpuXakz1nT-ZpX1PXTBWlF94rplNh-X8fZbL8jGnIv7yb7OY3dCLmopKdW6dUVcBlvftnIisBcfl37q0b8JpCihSgujn1CxyqLqg-eDmElbJRv6YmAo8IbdQ'
    },
    from: {
        from: 'Villa Blumer villablumer@gmail.com'
    }
});

transporter.verify(function (error, success) {
    if (error) console.log('Erro!', error);
    if (success) {
        transporter.on('token', token => {
            console.log(token.user, token.accessToken, token.expires)
        })
    }
});

function encontrarStatus(status) {
    switch (status) {
        case 0: {
            return TodosStatusPedido.EM_SEPARACAO;
        }
        case 1: {
            return TodosStatusPedido.DEVOLVIDO;
        }
        case 2: {
            return TodosStatusPedido.ENTREGUE;
        }
        default: {
            return -1;
        }
    };
};

function encontrarPagamento(pagamento) {
    switch (pagamento) {
        case 0:
            return TodasFormasPagamento.DINHEIRO
        case 1:
            return TodasFormasPagamento.CARTAO;
        case 2:
            return TodasFormasPagamento.BOLETO;
        default:
            return -1;
    };
};

async function verificarCliente(idCliente) {

    const collectionClientes = await bd.conectarBancoDados('clientes');

    const cliente = await collectionClientes.findOne({ _id: new ObjectId(idCliente) });

    if (cliente) return true;
    else return false;
};

async function verificarProduto(idProduto) {

    const collectionProdutos = await bd.conectarBancoDados('clientes');

    const produto = await collectionProdutos.findOne({ _id: new ObjectId(idProduto) });

    if (produto)
        return true;
    else
        return false;
};

async function enviarEmailFabrica(listaProdutos) {

    var arrayItems = "";
    var n;
    for (n in listaProdutos)
        arrayItems += "<li>" + JSON.stringify(listaProdutos[n]) + "</li>";


    let mensagem = {
        from: "villablumer@gmail.com",
        to: "msantana@alunos.utfpr.edu.br ",
        subject: "Pedido X: Fabricação de produtos",
        html: `<h1>Olá,</h1>
            <ol>
                ${arrayItems}
            </ol>
            `
    };

    let resposta = await transporter.sendMail(mensagem);

    if (resposta) return true;
    else return false;
};

async function encontrarProduto(idProduto) {

    if (ObjectId.isValid(idProduto) === false)
        return;

    const collectionProdutos = await bd.conectarBancoDados('produtos');

    const produto = await collectionProdutos.findOne({ _id: ObjectId(idProduto) });

    return produto;
}

module.exports = {
    async cadastrarPedido(req, res) {

        try {

            const formaPagamento = encontrarPagamento(req.body.formaPagamento);
            const statusPedido = encontrarStatus(req.body.statusPedido);

            if (req.body.idCliente) {
                const resposta = await verificarCliente(req.body.idCliente);

                if (resposta === false)
                    return res.status(404).json('Cliente não encontrado.');
            }

            if (statusPedido === -1) return res.status(400).json('Status do pedido inválido!');
            if (formaPagamento === -1) return res.status(400).json('Forma de pagamento inválida!');

            for (let i = 0; i < req.body.listaProdutos.length; i++)
                if (verificarProduto(req.body.listaProdutos[i].idProduto) === false)
                    return res.status(400).json('ID do produto inválido', req.body.listaProdutos[i].idProduto);

            const dataPedido = new Date();

            let dados = {
                ...req.body,
                dataPedido
            };

            if (!req.body.idCliente) novoPedido = new PedidoEmpresa(dados);
            else novoPedido = new PedidoCliente(dados);

            let listaProdutosFabricar = [];

            const collectionProdutos = await bd.conectarBancoDados('produtos');

            for (let i = 0; i < req.body.listaProdutos.length; i++) {
                let produtoComparar = await encontrarProduto(req.body.listaProdutos[i].idProduto);

                if (req.body.idCliente) {
                    if (produtoComparar.qtde - req.body.listaProdutos[i].qtde < 0) {

                        let produtoNovo = produtoComparar;

                        produtoNovo = {
                            ...produtoNovo,
                            qtde: req.body.listaProdutos[i].qtde - produtoComparar.qtde
                        };

                        listaProdutosFabricar.push(produtoNovo);
                    };

                    if (produtoComparar.qtde > 0) {
                        let quantidadeDecrementada = produtoComparar.qtde - req.body.listaProdutos[i].qtde;
                        await collectionProdutos.updateOne({ _id: ObjectId(req.body.listaProdutos[i].idProduto) }, { $inc: { qtde: quantidadeDecrementada } });
                    }

                } else {
                    let produtoNovo = produtoComparar;

                    produtoNovo = {
                        ...produtoNovo,
                        qtde: req.body.listaProdutos[i].qtde
                    };

                    listaProdutosFabricar.push(produtoNovo);

                    await collectionProdutos.updateOne({ _id: ObjectId(req.body.listaProdutos[i].idProduto) }, { $inc: { qtde: req.body.listaProdutos[i].qtde } });
                }
            }

            if (listaProdutosFabricar)
                enviarEmailFabrica(listaProdutosFabricar);

            const collectionPedidos = await bd.conectarBancoDados('pedidos');

            await collectionPedidos.insertOne(novoPedido);

            return res.status(200).json("Pedido cadastrado com sucesso.");
        } catch(err){
            console.log(err);
            return res.status(400).json('Erro ao cadastrar o pedido.');
        }
    },

    async listarPedido(req, res) {
        try {
            if (ObjectId.isValid(req.params.id) === false)
                return res.status(404).json('ID inválido.');

            const collectionPedidos = await bd.conectarBancoDados('pedidos');
            const pedido = await collectionPedidos.findOne({ "_id": ObjectId(req.params.id) });

            if (!pedido)
                return res.status(404).json('Pedido não encontrado.');

            return res.status(200).json(pedido);
        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro no carregamento das informações do pedido.');
        };
    },

    async excluirPedido(req, res) {
        try {
            if (ObjectId.isValid(req.params.id) === false)
                return res.status(404).json('ID inválido.');

            const collectionPedidos = await bd.conectarBancoDados('pedidos');
            const pedido = await collectionPedidos.findOne({ _id: ObjectId(req.params.id) });

            if (!pedido)
                return res.status(404).json('Pedido não encontrado.');

            let dataPedidoCadastrado = new Date(pedido.dataPedido);

            let hoje = new Date();

            const diferencaTempo = Math.abs(hoje.getTime() - dataPedidoCadastrado.getTime());

            const diferencaDataPedido = Math.ceil(diferencaTempo / (1000 * 3600 * 24));

            if (pedido.statusPedido === TodosStatusPedido.EM_SEPARACAO || diferencaDataPedido <= 30)
                return res.status(400).json('Não é possível excluir um pedido em aberto.');

            await collectionPedidos.deleteOne({ _id: ObjectId(req.params.id) });

            return res.status(400).json('Pedido excluído com sucesso!');
        } catch (err) {
            console.log(err);
            return res.status(400).json("Erro ao excluir pedido.")
        }
    },

    async listarPedidos(req, res) {
        try {
            const collectionPedidos = await bd.conectarBancoDados('pedidos');
            const pedidos = await collectionPedidos.find({}).toArray();

            return res.status(200).json(pedidos);
        } catch (err) {
            console.log(err);
            return res.status(400).json("Erro no carregamento das informações.");
        };
    },
};