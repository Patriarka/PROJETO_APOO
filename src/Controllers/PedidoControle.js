const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");

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
        console.log('Sucesso!', success);
        transporter.on('token', token => {
            console.log(token.user, token.accessToken, token.expires)
        })
    }
});

const bd = require("../bancoDados.js");

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

class PedidoEmpresa {

    static encontrarStatus(status) {
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

    static encontrarPagamento(pagamento) {
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

    constructor(formaPagamento, endereco, dataPedido, statusPedido, listaProdutos, idFabrica) {
        this.formaPagamento = PedidoEmpresa.encontrarPagamento(formaPagamento);
        this.statusPedido = PedidoEmpresa.encontrarStatus(statusPedido);
        this.endereco = endereco;
        this.dataPedido = dataPedido;
        this.listaProdutos = listaProdutos;
        this.idFabrica = idFabrica;
    };

    static async novoPedido(req, res) {
        try {
            const {
                listaProdutos
            } = req.body;
            
            for (let i = 0; i < listaProdutos.length; i++) { 
                if (verificarProduto(listaProdutos[i].idProduto) == false)
                    return res.status(400).json(`ID do produto inválido`, listaProdutos[i].idProduto);
            }
            // VERIFICA SE O ID DO PRODUTO EXISTE 
            // SE A QUANTIDADE A QUANTIDADE FOR == 0, TEMOS QUE PEDIR PARA A FÁBRICA FABRICAR,
            // ESSES PRODUTOS VÃO SER PASSADOS PARA UMA LISTA AO QUAL SERÁ FEITO O ENVIO DO EMAIL

            const collectionPedidos = await bd.conectarBancoDados('pedidos');

            const dataPedido = new Date();

            let { formaPagamento, endereco, statusPedido } = req.body

            let novoPedido = new PedidoEmpresa(formaPagamento, endereco, dataPedido, statusPedido, listaProdutos);

            if (novoPedido.statusPedido === -1 || novoPedido.formaPagamento === -1)
                return res.status(400).json('Status do pedido ou do pagamento inválido.');

            // await collectionPedidos.insertOne(novoPedido);

            PedidoEmpresa.enviarEmail(listaProdutos, 'etc');

            return res.status(200).json(novoPedido);

        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao cadastrar o pedido');
        };
    };

    static async pegarPedido(req, res) {
        try {
            const collectionPedidos = await bd.conectarBancoDados('pedidos');
            const pedido = await collectionPedidos.findOne({ "_id": ObjectId(req.params.id) });

            if (!pedido)
                return res.status(404).json('Pedido não encontrado.');

            res.status(200).json(pedido);
        } catch (err) {
            console.log(err);
            res.status(400).json('Erro no carregamento das informações');
        };
    };

    static async excluirPedido(req, res) {
        try {
            const collectionPedidos = await bd.conectarBancoDados('pedidos');
            const pedido = await collectionPedidos.findOne({ _id: ObjectId(req.params.id) });

            if (!pedido)
                res.status(404).json('Pedido não encontrado.');

            const diferencaTempo = Math.abs(Date.getTime() - pedido.statusPedido.getTime());
            const diferencaDataPedido = Math.ceil(diferencaTempo / (1000 * 3600 * 24));

            if (pedido.statusPedido === EM_SEPARACAO || diferencaDataPedido <= 30)
                return res.status(400).json('Não é possível excluir um pedido em aberto.');

            const pedidoExcluido = await collectionPedidos.deleteOne({ _id: ObjectId(req.params.id) });

            return res.status(400).json(pedidoExcluido);
        } catch (err) {
            return res.status(400).json("Erro ao excluir pedido.")
        }
    };

    static async enviarEmail(listaProdutos, idFabrica) {

        // pegar a collection fábricas e pegar o email da respectiva fabrica

        const collectionProdutos = await bd.conectarBancoDados('produtos');

        let produto = {};

        for (let i = 0; i < listaProdutos.length; i++) { // verificar e enviar apenas os produtos que precisamos fazer
            produto += await collectionProdutos.findOne( listaProdutos[i].id );
            console.log(JSON.stringify(produto[0]));
        }

        let mensagem = {
            from: "villablumer@gmail.com",
            to: "msantana@alunos.utfpr.edu.br ",
            subject: "Pedido X: Fabricação de produtos",
            html: `<p>${JSON.stringify(produto)}</p>`
        };

        let resposta = await transporter.sendMail(mensagem);

        console.log('aq', resposta);

        if(resposta)
            return true;
        else return false;
    };
};

class PedidoCliente extends PedidoEmpresa {

    constructor(formaPagamento, endereco, dataPedido, statusPedido, idCliente, listaProdutos, idFabrica) {
        super(formaPagamento, endereco, dataPedido, statusPedido, idCliente, listaProdutos, idFabrica);
        this.idCliente = idCliente;
    };

    static async novoPedido(req, res) {
        try {

            const objectIdValido = ObjectId.isValid(req.body.idCliente);

            if (objectIdValido === false)
                return res.status(400).json('ID inválido.');

            const resposta = await verificarCliente(new ObjectId(req.body.idCliente));

            if (resposta === false)
                return res.status(404).json('Cliente não encontrado.');

            const {
                listaProdutos
            } = req.body;

            for (let i = 0; i < listaProdutos.length; i++) {
                if (verificarProduto(listaProdutos[i].idProduto) == false);
                return res.status(400).json(`ID do produto inválido`);
            }

            const collectionPedidos = await bd.conectarBancoDados('pedidos');

            const dataPedido = new Date();

            let {
                formaPagamento, endereco, statusPedido, idCliente
            } = req.body

            let novoPedido = new PedidoCliente(formaPagamento, endereco, dataPedido, statusPedido, idCliente, listaProdutos);

            if (novoPedido.statusPedido === -1 || novoPedido.formaPagamento === -1)
                return res.status(400).json('Status do pedido ou do pagamento inválido.');

            await collectionPedidos.insertOne(novoPedido);

            // PedidoCliente.enviarEmail(w, 'etc');

            return res.status(200).json(novoPedido);

        } catch (err) {
            console.log(err);
            return res.status(400).json('Erro ao cadastrar o pedido');
        };
    }
};

async function verificarCliente(idCliente) {

    const collectionClientes = await bd.conectarBancoDados('clientes');

    const cliente = await collectionClientes.findOne({ _id: new ObjectId(idCliente) });

    if (cliente)
        return true;
    else
        return false;
};

async function verificarProduto(idProduto) {

    const collectionProdutos = await bd.conectarBancoDados('clientes');

    const produto = await collectionProdutos.findOne({ _id: new ObjectId(idProduto) });

    if (produto)
        return true;
    else
        return false;
};

async function listarTodosPedidos(req, res) {
    try {
        const collectionPedidos = await bd.conectarBancoDados('pedidos');
        const pedidos = await collectionPedidos.find({}).toArray();

        return res.status(200).json(pedidos);
    } catch (err) {
        return res.status(400).json("Erro no carregamento das informações.");
    };
};

module.exports = { PedidoEmpresa, PedidoCliente, listarTodosPedidos };