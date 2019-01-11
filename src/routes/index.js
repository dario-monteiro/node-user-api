const express = require('express')
const cadastro = require('../controller/cadastro')

const router = express.Router()

router.post('/signin', cadastro.signin)
router.post('/signup', cadastro.signup)
router.get('/viewProfile', cadastro.viewProfile)

module.exports = router