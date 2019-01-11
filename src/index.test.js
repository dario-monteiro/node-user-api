const test = require('tape')
const supertest = require('supertest')
const index = require('./index')
const Status = require('http-status')
var token = "";

test('POST /api/signup - cadastro com sucesso', (t) => {
    const cadastro = {
        nome: "Dario Monteiro",
        email: "dario.monteiro@hotmail.com",
        senha: "123456",
        endereco: "Av. Presidente Wilson, 231 29o andar Centro",
        cidade: "Rio de Janeiro",
        cep: "21000010",
        estado: "RJ",
        pais: "Brasil",
        telefone: "",
        celular: "(21) 99357-6126"
    }
    supertest(index)
        .post('/api/signup')
        .send(cadastro)
        .expect('Content-Type', /json/)
        .expect(Status.CREATED)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.message === "Cadastro criado com sucesso", "Cadastro efetuado com sucesso")
            t.end()
        })
})

test('POST /api/signup - cadastro email já existente', (t) => {
    const cadastro = {
        nome: "Dario Monteiro",
        email: "dario.monteiro@hotmail.com",
        senha: "123456",
        endereco: "",
        cidade: "",
        cep: "",
        estado: "",
        pais: "",
        telefone: "",
        celular: ""
    }
    supertest(index)
        .post('/api/signup')
        .send(cadastro)
        .expect('Content-Type', /json/)
        .expect(Status.INTERNAL_SERVER_ERROR)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.message === "e-mail já existente", "Tentativa de cadastro de email ja existente")
            t.end()
        })
})

test('POST /api/signin - login com sucesso', (t) => {
    const login = { email: "dario.monteiro@hotmail.com", senha: "123456" }
    supertest(index)
        .post('/api/signin')
        .send(login)
        .expect('Content-Type', /json/)
        .expect(Status.OK)
        .end((err, res) => {
            token = res.body.token
            t.error(err, 'Sem erros')
            t.assert(res.body.cadastro.nome === "Dario Monteiro", "Login com sucesso")
            t.end()
        })
})

test('POST /api/signin - senha incorreta', (t) => {
    const login = { email: "dario.monteiro@hotmail.com", senha: "12345" }
    supertest(index)
        .post('/api/signin')
        .send(login)
        .expect('Content-Type', /json/)
        .expect(Status.INTERNAL_SERVER_ERROR)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.message === "Usuário e/ou senha inválidos", "Tentativa de Login com senha incorreta")
            t.end()
        })
})

test('POST /api/signin - email incorreto', (t) => {
    const login = { email: "dario.monteiro@hotmail.com.br", senha: "123456" }
    supertest(index)
        .post('/api/signin')
        .send(login)
        .expect('Content-Type', /json/)
        .expect(Status.INTERNAL_SERVER_ERROR)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.message === "Usuário e/ou senha inválidos", "Tentativa de Login com email incorreto")
            t.end()
        })
})

test('GET /api/viewProfile - recupera perfil sem token', (t) => {
    supertest(index)
        .get('/api/viewProfile?token=')
        .expect('Content-Type', /json/)
        .expect(Status.INTERNAL_SERVER_ERROR)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.message === "No token provided", "Tentativa recuperar perfil sem token")
            t.end()
        })
})

test('GET /api/viewProfile - recupera perfil (token invalido)', (t) => {
    supertest(index)
        .get('/api/viewProfile?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ3MDY4NjU3LCJleHAiOjE1NDcwNjg5NTd9.CNLzmSKvaaKNUsV10MYetWFEucpuje6fzg5-hNNjuKQ')
        .expect('Content-Type', /json/)
        .expect(Status.INTERNAL_SERVER_ERROR)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.message === "Failed to authenticate token", "Tentativa recuperar perfil com token invalido")
            t.end()
        })
})

//IMPORTANTE: Esse test tem dependencia do test de login com sucesso para gerar o token corretamente
test('GET /api/viewProfile - recupera perfil (token valido)', (t) => {
    supertest(index)
        .get('/api/viewProfile?token=' + token)
        .expect('Content-Type', /json/)
        .expect(Status.OK)
        .end((err, res) => {
            t.error(err, 'Sem erros')
            t.assert(res.body.cadastro.nome === "Dario Monteiro", "Perfil recuperado com sucesso")
            t.end()
        })
})
