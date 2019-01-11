const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Cadastro = sequelize.define("cadastro", {
    id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
    },
    nome: {
        allowNull: false,
        type: Sequelize.STRING(50)
    },
    email: {
        allowNull: false,
        type: Sequelize.STRING(40)
    },
    senha: {
        allowNull: false,
        type: Sequelize.STRING(100)
    },
    endereco: {
        allowNull: true,
        type: Sequelize.STRING(100)
    },
    cidade: {
        allowNull: true,
        type: Sequelize.STRING(40)
    },
    cep: {
        allowNull: true,
        type: Sequelize.INTEGER
    },
    estado: {
        allowNull: true,
        type: Sequelize.STRING(40)
    },
    pais: {
        allowNull: true,
        type: Sequelize.STRING(40)
    },
    telefone: {
        allowNull: true,
        type: Sequelize.STRING(15)
    },
    celular: {
        allowNull: true,
        type: Sequelize.STRING(15)
    }
}, {
        tableName: 'cadastro'
    });

module.exports = Cadastro;
