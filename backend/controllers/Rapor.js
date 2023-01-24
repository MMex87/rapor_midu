const db = require("../config/Database.js")
const Rapor = require("../models/raporModel.js")

const getRapor = async (req, res) => {
    try {
        const [rapor] = await db.query('SELECT r.id, r.semester, r.jenis_rapor, r.id_siswa, r.id_kelas, a.tahun_ajar as angkatan ' +
            'FROM rapor as r INNER JOIN ' +
            'tahun_ajar as a on a.id = r.id_tahunAjar')
        if (rapor === 0)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        res.json(rapor)
    } catch (error) {
        console.log(error)
    }
}

const getRaporId = async (req, res) => {
    try {
        const [rapor] = await db.query('SELECT r.id, r.semester, r.jenis_rapor, r.id_siswa, r.id_kelas, a.tahun_ajar as angkatan ' +
            'FROM rapor as r INNER JOIN ' +
            'tahun_ajar as a on a.id = r.id_tahunAjar ' +
            `WHERE r.id = ${req.params.id}`)
        if (rapor === null)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        res.json(rapor)
    } catch (error) {
        console.log(error)
    }
}

const getRaporIdSiswa = async (req, res) => {
    try {
        const [rapor] = await db.query('SELECT r.id, r.semester, r.jenis_rapor, r.id_siswa, r.id_kelas, a.tahun_ajar as angkatan ' +
            'FROM rapor as r INNER JOIN ' +
            'tahun_ajar as a on a.id = r.id_tahunAjar ' +
            `WHERE r.id_kelas = ${req.params.idKelas} AND ` +
            `r.id_siswa = ${req.params.idSiswa} AND ` +
            `r.jenis_rapor = '${req.params.jenisR}' AND ` +
            `r.semester = '${req.params.semester}'`
        )
        if (rapor === null)
            res.status(404).json({ msg: "Data Tidak di Temukan" })
        res.json(rapor)
    } catch (error) {
        console.log(error);
    }
}

const tambahRapor = async (req, res) => {
    const { semester, jenis_rapor, id_siswa, id_kelas, id_tahunAjar } = req.body
    try {
        const rapor = await Rapor.create({
            semester, jenis_rapor, id_siswa, id_kelas, id_tahunAjar
        })
        if (rapor === 0)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        res.json({ msg: "Data Berhasil Ditambahkan" })
    } catch (error) {
        console.log(error);
    }
}

const editRapor = async (req, res) => {
    const { semester, jenis_rapor, id_siswa, id_kelas, id_tahunAjar } = req.body
    try {
        const rapor = await Rapor.update({
            semester, jenis_rapor, id_siswa, id_kelas, id_tahunAjar
        }, {
            where: {
                id: req.params.id
            }
        })
        if (rapor == 0) {
            res.status(404).json({ msg: "Data Tidak di temukan" })
        } else {
            res.json({ msg: "Data Berhasil Di Ubah" })
        }
    } catch (error) {
        console.log(error)
    }
}

const hapusRapor = async (req, res) => {
    try {
        const rapor = await Rapor.destroy({
            where: {
                id: req.params.id
            }
        })
        if (rapor === 0)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        res.json({ msg: "Data Berhasil Terhapus" })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getRapor,
    getRaporId,
    getRaporIdSiswa,
    tambahRapor,
    hapusRapor,
    editRapor
}