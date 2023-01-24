const Mapel = require("../models/mapelModel.js")
const db = require('../config/Database.js')


const getMapel = async (req, res) => {
    try {
        const [mapel] = await db.query("SELECT m.id, m.kkm, m.idGuru, m.id_kelas, m.id_NMapel, n.nama ,n.induk ,m.id_tahunAjar ,t.tahun_ajar " +
            "FROM mapel as m " +
            "INNER JOIN nama_mapel as n " +
            "on m.id_NMapel = n.id " +
            "INNER JOIN tahun_ajar as t " +
            "on m.id_tahunAjar = t.id")
        res.json(mapel)
    } catch (error) {
        console.log(error)
    }
}

const getMapelId = async (req, res) => {
    try {
        const [mapel] = await db.query("SELECT m.id, m.kkm, m.idGuru, m.id_kelas, m.id_NMapel, n.nama,n.induk,m.id_tahunAjar FROM mapel as m " +
            "INNER JOIN nama_mapel as n " +
            `on m.id_NMapel = n.id ` +
            "INNER JOIN tahun_ajar as t " +
            "on m.id_tahunAjar = t.id " +
            `WHERE m.id = ${req.params.id}`)
        if (mapel === null)
            res.status(404).json({ msg: "Data Kosong" })
        else
            res.json(mapel[0])
    } catch (error) {
        res.status(404).json({ msg: "Data Tidak di temukan" })
    }
}
const getMapelKelas = async (req, res) => {
    try {
        const [mapel] = await db.query("SELECT m.id, m.kkm, m.idGuru, m.id_kelas, m.id_NMapel, n.nama,n.induk,m.id_tahunAjar FROM mapel as m " +
            "INNER JOIN nama_mapel as n " +
            `on m.id_NMapel = n.id ` +
            "INNER JOIN tahun_ajar as t " +
            "on m.id_tahunAjar = t.id " +
            `WHERE m.id_kelas = ${req.params.idKelas}`)

        const [nama] = await db.query("SELECT n.nama FROM mapel as m " +
            "INNER JOIN nama_mapel as n " +
            `on m.id_NMapel = n.id ` +
            "INNER JOIN tahun_ajar as t " +
            "on m.id_tahunAjar = t.id " +
            `WHERE m.id_kelas = ${req.params.idKelas}`)

        const kkm = await db.query("SELECT m.kkm FROM mapel as m " +
            "INNER JOIN nama_mapel as n " +
            `on m.id_NMapel = n.id ` +
            "INNER JOIN tahun_ajar as t " +
            "on m.id_tahunAjar = t.id " +
            `WHERE m.id_kelas = ${req.params.idKelas}`)


        if (mapel === null || nama === null || kkm === null)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        else
            res.json({ mapel, nama, kkm })
    } catch (error) {
        res.status(404).json({ msg: "Data Tidak di temukan" })
    }
}

const tambahMapel = async (req, res) => {
    const { kkm, idGuru, id_kelas, id_NMapel, id_tahunAjar } = req.body
    try {
        const mapel = await Mapel.create({ kkm, idGuru, id_kelas, id_NMapel, id_tahunAjar })

        if (mapel === 0)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        res.json({ msg: "Data Berhasil Ditambahkan" })

    } catch (error) {
        console.log(error);
    }
}

const editMapel = async (req, res) => {
    const { kkm, idGuru, id_kelas, id_NMapel, id_tahunAjar } = req.body
    const id = req.params.id

    try {
        const mapel = await Mapel.update({ kkm, idGuru, id_kelas, id_NMapel, id_tahunAjar }, {
            where: {
                id
            }
        })
        if (mapel == 1)
            res.json({ msg: "Data Berhasil Di Ubah" })
        else
            res.status(404).json({ msg: "Data Tidak di temukan" })

        // res.json(mapel)
    } catch (error) {
        console.log(error);
    }
}

const hapusMapel = async (req, res) => {
    try {
        const mapel = await Mapel.destroy({ where: { id: req.params.id } })

        if (mapel === 1)
            res.json({ msg: "Data Berhasil Terhapus" })
        else
            res.status(404).json({ msg: "Data Tidak di temukan" })

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    hapusMapel,
    editMapel,
    tambahMapel,
    getMapelKelas,
    getMapelId,
    getMapel,
}