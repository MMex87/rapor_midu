const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")

const { DataTypes } = Sequelize


const Kelas = db.define('kelas', {
    kelas: {
        type: DataTypes.STRING
    },
    nama_kelas: {
        type: DataTypes.STRING
    },
    id_guru: {
        type: DataTypes.INTEGER
    },
    id_tahunAjar: {
        type: DataTypes.INTEGER
    },

}, {
    indexes: [
        {
            fields: ['id_guru']
        },
        {
            fields: ['id_tahunAjar']
        }
    ],
    freezeTableName: true
})

module.exports = Kelas