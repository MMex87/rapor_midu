const Kelas = require("../models/kelasModel.js")
const db = require("../config/Database.js")
const TahunAjar = require("../models/TahunAjarModel.js")
const Siswa = require("../models/siswaModel.js")
const Mapel = require("../models/mapelModel.js")
const Nilai = require("../models/nilaiModel.js")


const getKelas = async (req, res) => {
    try {
        const tahunAjar = await TahunAjar.findOne({
            attributes: ['id', 'tahun_ajar'],
            order: [
                ['id', 'DESC']
            ]
        })

        const [kelas] = await db.query("SELECT k.id, k.kelas, k.nama_kelas, k.id_guru, k.id_tahunAjar, t.tahun_ajar " +
            "FROM kelas as k " +
            "INNER JOIN tahun_ajar as t " +
            "on k.id_tahunAjar = t.id " +
            `WHERE k.id_tahunAjar = ${tahunAjar.id} ` +
            "ORDER BY k.kelas ASC")
        res.json(kelas)
    } catch (error) {
        console.log(error)
    }
}

const getKelasId = async (req, res) => {
    try {
        const kelas = await Kelas.findOne({
            where: {
                id: req.params.id
            }
        })
        if (kelas === null)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        else
            res.json(kelas)


    } catch (error) {
        res.status(404).json({ msg: "Data Tidak di temukan" })
    }
}
const getKelasGuru = async (req, res) => {
    try {
        const [kelas] = await db.query("SELECT k.id, k.kelas, k.nama_kelas, k.id_guru, k.id_tahunAjar, t.tahun_ajar " +
            'FROM kelas as k ' +
            'INNER JOIN tahun_ajar as t ' +
            'on k.id_tahunAjar = t.id ' +
            `WHERE k.id_guru =  ${req.params.idGuru} ` +
            "ORDER BY k.kelas ASC ")
        if (kelas === null)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        else
            res.json(kelas)

    } catch (error) {
        res.status(404).json({ msg: "Data Tidak di temukan" })
    }
}

const getKelasSearchGuru = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const offset = limit * page

        const [totalRows] = await db.query("SELECT COUNT(k.id) as jumlah " +
            'FROM kelas as k ' +
            'INNER JOIN tahun_ajar as t ' +
            'on k.id_tahunAjar = t.id ' +
            `WHERE k.id_guru =  ${req.query.idGuru} ` +
            "ORDER BY t.tahun_ajar DESC ")

        const totalPage = Math.ceil(totalRows[0].jumlah / limit)

        const [result] = await db.query("SELECT k.id, k.kelas, k.nama_kelas, k.id_guru, k.id_tahunAjar, t.tahun_ajar " +
            'FROM kelas as k ' +
            'INNER JOIN tahun_ajar as t ' +
            'on k.id_tahunAjar = t.id ' +
            `WHERE k.id_guru =  ${req.query.idGuru} ` +
            "ORDER BY t.tahun_ajar DESC " +
            `LIMIT ${offset},${limit} `
        )

        res.json({
            page,
            result,
            totalPage,
            totalRows: totalRows[0].jumlah,
            limit
        })

    } catch (error) {
        res.status(404).json({ msg: "Data Tidak di temukan", error })
    }
}

const getProgresKelas = async (req, res) => {
    try {
        const tahunAjar = await TahunAjar.findOne({
            attributes: ['id', 'tahun_ajar'],
            order: [
                ['id', 'DESC']
            ]
        })

        const [kelas] = await db.query("SELECT k.id, k.kelas, k.nama_kelas, k.id_guru, k.id_tahunAjar, t.tahun_ajar " +
            "FROM kelas as k " +
            "INNER JOIN tahun_ajar as t " +
            "ON k.id_tahunAjar = t.id " +
            `WHERE k.id_tahunAjar = ${tahunAjar.id} ` +
            "ORDER BY k.kelas ASC")

        if (kelas != null) {
            let progres = [];
            let idKelas = [];
            for (let k of kelas) {
                let point = 0
                const rows = await Siswa.findAll({
                    attributes: ['id', 'nisn', 'nis', 'nama', 'tanggal_lahir', 'jenis_kelamin', 'status', 'id_kelas'],
                    where: { id_kelas: k.id }
                })
                const mapel = await Mapel.findAll({
                    where: {
                        id_kelas: k.id
                    }
                })
                for (let s of rows) {
                    // const nilai = await Nilai.findAll({
                    //     attributes: ['nilai'],
                    //     where: {
                    //         id_siswa: s.id,
                    //         jenis_rapor: 'UAS',
                    //         semester: 'Genap'
                    //     }
                    // })
                    // const nilaiKet = await Nilai.findAll({
                    //     attributes: ['nilai_keterampilan'],
                    //     where: {
                    //         id_siswa: s.id,
                    //         jenis_rapor: 'UAS',
                    //         semester: 'Genap'
                    //     }
                    // })
                    const [nilai] = await db.query("SELECT COUNT(n.nilai) as jumlahNilai, COUNT(n.nilai_keterampilan) as jumlahNilaiKet " +
                        "FROM nilai as n " +
                        "INNER JOIN rapor as r " +
                        "on n.id_rapor = r.id " +
                        `WHERE n.id_siswa = ${s.id} AND r.id_kelas = ${k.id} AND r.semester = 'Genap' AND r.jenis_rapor = 'UAS'`)
                    console.log(nilai[0].jumlahNilai);
                    if (nilai[0].jumlahNilai == nilai[0].jumlahNilaiKet) {
                        if (nilai[0].jumlahNilai == mapel.length && nilai[0].jumlahNilai == mapel.length) {
                            point = point + 1
                        }
                    }
                }
                let persen = point / rows.length * 100
                // progres.id = k.id
                progres.push(persen)
                idKelas.push(k.id)
            }
            // res.json({ idKelas, progres })
            res.json(progres)
        }

        // res.json(tahunAjar)
    } catch (error) {
        res.status(404).json({ msg: "Gagal Tersambung", error })
    }
}

const tambahKelas = async (req, res) => {
    const { kelas, nama_kelas, id_guru, id_tahunAjar } = req.body
    try {
        await Kelas.create({ kelas, nama_kelas, id_guru, id_tahunAjar })

        res.json({ msg: "Data Berhasil Di Tambahakan" })
    } catch (error) {
        console.log(error);
    }
}

const editKelas = async (req, res) => {
    const { kelas, nama_kelas, id_guru, id_tahunAjar } = req.body
    const id = req.params.id

    try {
        const kel = await Kelas.update({
            kelas, nama_kelas
            , id_guru, id_tahunAjar
        }, {
            where: {
                id
            }
        })
        if (kel == 1)
            res.json({ msg: "Data Berhasil Di Ubah" })
        else
            res.status(404).json({ msg: "Data Tidak di temukan" })

        // res.json(kelas)
    } catch (error) {
        console.log(error);
    }
}

const hapusKelas = async (req, res) => {
    try {
        const kelas = await Kelas.destroy({ where: { id: req.params.id } })

        if (kelas === 1)
            res.json({ msg: "Data Berhasil Terhapus" })
        else
            res.status(404).json({ msg: "Data Tidak di temukan" })

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    hapusKelas,
    editKelas,
    tambahKelas,
    getKelasId,
    getKelasGuru,
    getKelas,
    getProgresKelas,
    getKelasSearchGuru
}