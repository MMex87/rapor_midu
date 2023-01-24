const { Sequelize } = require("sequelize")
const db = require("../config/Database.js")

const { DataTypes } = Sequelize


const Siswa = db.define('siswa', {
    nisn: {
        type: DataTypes.STRING
    },
    nis: {
        type: DataTypes.STRING
    },
    nama: {
        type: DataTypes.STRING
    },
    tanggal_lahir: {
        type: DataTypes.DATEONLY
    },
    jenis_kelamin: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
    id_kelas: {
        type: DataTypes.STRING
    },
}, {
    indexes: [
        {
            fields: ['id_kelas']
        }
    ]
})

module.exports = Siswa