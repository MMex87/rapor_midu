const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")

const { DataTypes } = Sequelize

const NamaMapel = db.define('nama_mapel', {
    nama: { type: DataTypes.STRING },
    induk: { type: DataTypes.STRING },
}, {
    freezeTableName: true
})


module.exports = NamaMapel