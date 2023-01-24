const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")

const { DataTypes } = Sequelize

const Guru = db.define('guru', {
    nama: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.TEXT
    },
    jtm: {
        type: DataTypes.STRING
    },
    nuptk: {
        type: DataTypes.STRING
    },
    pendidikan: {
        type: DataTypes.STRING,
    },
    tanggal_lahir: {
        type: DataTypes.DATE
    },
    jenis_kelamin: {
        type: DataTypes.STRING
    },
    picture: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
})

module.exports = Guru