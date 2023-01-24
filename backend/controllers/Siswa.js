const { Op } = require("sequelize")
const Siswa = require("../models/siswaModel.js")

const getSiswa = async (req, res) => {
    try {
        const siswa = await Siswa.findAll({
            attributes: ['id', 'nisn', 'nis', 'nama', 'tanggal_lahir', 'jenis_kelamin', 'status', 'id_kelas']
        })
        if (siswa === 0)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        res.json(siswa)
    } catch (error) {
        console.log(error)
    }
}
const getSearchSiswa = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.search || ''
        const offset = limit * page
        const totalRows = await Siswa.count({
            where: {
                [Op.or]: [{
                    nama: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    nis: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    nisn: {
                        [Op.like]: '%' + search + '%'
                    }
                }
                ]
            }
        })
        const totalPage = Math.ceil(totalRows / limit)
        const result = await Siswa.findAll({
            where: {
                [Op.or]: [{
                    nama: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    nis: {
                        [Op.like]: '%' + search + '%'
                    }
                }, {
                    nisn: {
                        [Op.like]: '%' + search + '%'
                    }
                }
                ]
            },
            offset,
            limit,
            order: [
                ['id', 'DESC']
            ]
        })
        res.json({
            page,
            result,
            totalPage,
            totalRows,
            limit
        })
    } catch (error) {
        console.log(error)
    }
}
const getPageSiswa = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const idKelas = req.query.idKelas || ''
        const offset = limit * page
        const totalRows = await Siswa.count({
            where: {
                [Op.or]: [{
                    id_kelas: idKelas
                }
                ]
            }
        })
        const totalPage = Math.ceil(totalRows / limit)
        const result = await Siswa.findAll({
            where: {
                [Op.or]: [{
                    id_kelas: idKelas
                }
                ]
            },
            offset,
            limit,
            order: [
                ['id', 'DESC']
            ]
        })
        res.json({
            page,
            result,
            totalPage,
            totalRows,
            limit
        })
    } catch (error) {
        console.log(error)
    }
}

const getSiswaRecent = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5
        const totalRows = await Siswa.count()
        const totalPage = Math.ceil(totalRows / limit)
        const result = await Siswa.findAll({
            limit,
            order: [
                ['id', 'DESC']
            ]
        })
        res.json({
            result,
            totalPage,
            totalRows,
            limit
        })
    } catch (error) {
        console.log(error)
    }
}

const getSiswaId = async (req, res) => {
    try {
        const siswa = await Siswa.findOne({ where: { id: req.params.id } })
        if (siswa === null)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        res.json(siswa)
    } catch (error) {
        console.log(error)
    }
}

const getSiswaIdKelas = async (req, res) => {
    try {
        const siswa = await Siswa.findOne({ where: { id_kelas: req.params.idKelas } })
        if (siswa === null)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        res.json(siswa)
    } catch (error) {
        console.log(error)
    }
}

const tambahSiswa = async (req, res) => {
    const { nisn, nis, nama, tanggal_lahir, jenis_kelamin, status, id_kelas } = req.body
    try {
        const siswa = await Siswa.create({
            nisn, nis, nama, tanggal_lahir, jenis_kelamin, status, id_kelas
        })
        if (siswa === 0)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        res.json({ msg: "Data Berhasil Ditambahkan" })
    } catch (error) {
        console.log(error);
    }
}

const editSiswa = async (req, res) => {
    const { nisn, nis, nama, tanggal_lahir, jenis_kelamin, status, id_kelas } = req.body
    try {
        const siswa = await Siswa.update({
            nisn, nis, nama, tanggal_lahir, jenis_kelamin, status, id_kelas
        }, {
            where: {
                id: req.params.id
            }
        })
        if (siswa == 0) {
            res.status(404).json({ msg: "Data Tidak di temukan" })
        } else {
            res.json({ msg: "Data Berhasil Di Ubah" })
        }
    } catch (error) {
        console.log(error)
    }
}

const hapusSiswa = async (req, res) => {
    try {
        const siswa = await Siswa.destroy({
            where: {
                id: req.params.id
            }
        })
        if (siswa === 0)
            res.status(404).json({ msg: "Data Tidak di temukan" })
        res.json({ msg: "Data Berhasil Terhapus" })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getPageSiswa,
    getSearchSiswa,
    getSiswa,
    getSiswaId,
    getSiswaRecent,
    tambahSiswa,
    editSiswa,
    hapusSiswa,
    getSiswaIdKelas
}