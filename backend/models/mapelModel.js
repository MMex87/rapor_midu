const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")
const NamaMapel = require("./namaMapelModel.js")

const { DataTypes } = Sequelize

const Mapel = db.define('mapel', {
    kkm: { type: DataTypes.STRING },
    idGuru: { type: DataTypes.INTEGER },
    id_kelas: { type: DataTypes.INTEGER },
    id_NMapel: { type: DataTypes.INTEGER },
    id_tahunAjar: { type: DataTypes.INTEGER }
}, {
    indexes: [
        {
            fields: ['idGuru']
        },
        {
            fields: ['id_kelas'],
        },
        {
            fields: ['id_NMapel']
        },
        {
            fields: ['id_tahunAjar']
        }

    ],
    freezeTableName: true
})

Mapel.hasOne(NamaMapel, { foreignKey: 'id' })
Mapel.belongsTo(NamaMapel, { foreignKey: 'id' })

module.exports = Mapel