const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")

const { DataTypes } = Sequelize

const TahunAjar = db.define('tahun_ajar', {
    tahun_ajar: { type: DataTypes.STRING },
})

module.exports = TahunAjar