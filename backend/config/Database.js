const { Sequelize } = require("sequelize")

const db = new Sequelize('db_rapor_midu', 'root', '', {
    host: "localhost",
    dialect: "mysql",
    define: { freezeTableName: true }
})

module.exports = db