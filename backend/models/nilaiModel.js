const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")

const { DataTypes } = Sequelize

const Nilai = db.define('nilai', {
    nilai: { type: DataTypes.INTEGER },
    nilai_keterampilan: { type: DataTypes.INTEGER },
    id_jenis_nilai: { type: DataTypes.INTEGER },
    id_siswa: { type: DataTypes.INTEGER },
    id_mapel: { type: DataTypes.INTEGER },
    id_rapor: { type: DataTypes.INTEGER }
}, {
    indexes: [
        {
            fields: ['id_siswa'],
            fields: ['id_mapel'],
            fields: ['id_rapor']
        }
    ]
})

module.exports = Nilai