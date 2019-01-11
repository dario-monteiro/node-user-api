const Cadastro = require('../model/cadastro')
const Status = require('http-status')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const chaveSenha = bcrypt.genSaltSync(10)

exports.viewProfile = (request, response, next) => {
    const token = request.headers['x-access-token'] || request.query.token

    if (!token) return response.status(Status.INTERNAL_SERVER_ERROR).send({ auth: false, message: 'No token provided' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return response.status(Status.INTERNAL_SERVER_ERROR).send({ auth: false, message: 'Failed to authenticate token' });

        Cadastro.findById(decoded.id).then((cadastro) => {
            if (cadastro) {
                response.status(Status.OK).send({ cadastro: cadastro })
            } else {
                response.status(Status.NOT_FOUND).send({ message: "Cadastro não encontrado" })
            }
        }).catch((error) => next(error))
    })
}

exports.signin = (request, response, next) => {
    const email = request.body.email
    const senha = request.body.senha
    var passEncrypt = bcrypt.hashSync(senha, chaveSenha)

    Cadastro.findOne({ where: { email: email, senha: passEncrypt } }).then((cadastro) => {
        if (cadastro) {
            var id = cadastro.id
            var token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: process.env.TOKEN_EXP_TIME
            });
            response.status(Status.OK).send({ auth: true, token: token, cadastro: cadastro })
        } else {
            response.status(Status.INTERNAL_SERVER_ERROR).send({ message: "Usuário e/ou senha inválidos" })
        }
    }).catch((error) => next(error))
}

exports.signup = (request, response, next) => {
    const nome = request.body.nome
    const email = request.body.email
    const senha = request.body.senha
    const endereco = request.body.endereco
    const cidade = request.body.cidade
    const cep = request.body.cep
    const estado = request.body.estado
    const pais = request.body.pais
    const telefone = request.body.telefone
    const celular = request.body.celular
    var passEncrypt = bcrypt.hashSync(senha, chaveSenha)

    Cadastro.findOne({ where: { email: email } }).then((cadastro) => {
        if (cadastro) {
            response.status(Status.INTERNAL_SERVER_ERROR).send({ message: "e-mail já existente" })
        } else {
            Cadastro.create({
                nome: nome,
                email: email,
                senha: passEncrypt,
                endereco: endereco,
                cidade: cidade,
                cep: cep,
                estado: estado,
                pais: pais,
                telefone: telefone,
                celular: celular

            }).then(() => {
                response.status(Status.CREATED).send({ message: "Cadastro criado com sucesso" })
            }).catch((error) => next(error))
        }
    }).catch((error) => next(error))
}
