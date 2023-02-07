const TahunAjar = require("../models/TahunAjarModel")


const getTahun = async (req, res) => {
    try {
        const tahun = await TahunAjar.findAll({
            attributes: ['tahun_ajar'],
            order: [
                ['id', 'DESC']
            ]
        })

        if (tahun == null) {
            res.status(401).json({ msg: 'Data Kosong' })
        } else {
            res.json(tahun)
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Gagal Mengambil Data! " + error })
    }
}

const getTahunPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0
        const limit = parseInt(req.query.limit) || 10
        const offset = limit * page

        const totalRows = await TahunAjar.count()

        const totalPage = Math.ceil(totalRows / limit)

        const result = await TahunAjar.findAll({
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
        res.status(404).json({ msg: "Data Tidak di temukan", error })
    }
}

const getTahunLogin = async (req, res) => {
    try {
        const tahun = await TahunAjar.findAll({
            attributes: ['tahun_ajar'],
            order: [
                ['id', 'DESC']
            ]
        })

        if (tahun == null) {
            res.status(401).json({ msg: 'Data Kosong' })
        } else {
            res.json(tahun)
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Gagal Mengambil Data! " + error })
    }
}
const getTahunId = async (req, res) => {
    try {
        const tahun = await TahunAjar.findOne({
            attributes: ['id', 'tahun_ajar'],
            where: { tahun_ajar: req.params.tahun + '/' + req.params.tahun2 },
            order: [
                ['id', 'DESC']
            ]
        })

        if (tahun == null) {
            res.status(401).json({ msg: 'Data Kosong' })
        } else {
            res.json(tahun)
        }
    } catch (error) {
        console.log(error);
        res.json({ msg: "Gagal Mengambil Data! " + error })
    }
}

const tambahTahun = async (req, res) => {
    const { tahun_ajar } = req.body
    try {
        await TahunAjar.create({
            tahun_ajar
        })
        res.status(200).json({ msg: 'Data Berhasil Ditambahakan' })

    } catch (error) {
        console.log(error);
        res.json({ msg: "Gagal Menambah Data! " + error })
    }
}

const updateTahun = async (req, res) => {
    const { tahun_ajar } = req.body
    try {
        await TahunAjar.update({
            tahun_ajar
        }, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Data Berhasil DiUbah" })
    } catch (error) {
        console.log(error);
        res.json({ msg: "Gagal Mengubah Data! " + error })
    }
}

const deleteTahun = async (req, res) => {
    try {
        await TahunAjar.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({ msg: "Data Berhasil Terhapus" })
    } catch (error) {
        console.log(error);
        res.json({ msg: "Gagal Mehapus Data! " + error })
    }
}

module.exports = {
    getTahun,
    getTahunLogin,
    getTahunId,
    tambahTahun,
    updateTahun,
    deleteTahun,
    getTahunPage
}