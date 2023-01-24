const express = require("express")
const { DeleteUser, getSuper, getUsers, getUsersId, Login, Logout, Register, UpdateEmail, UpdatePass, UpdateProfil, UpdateUser } = require("../controllers/Users.js")
const { verifyToken } = require("../middleware/VerifyToken.js")
const { refreshToken, refreshTokenGuru } = require("../controllers/RefreshToken.js")
const guru = require("../controllers/Gurus.js")
const kelas = require("../controllers/Kelas.js")
const nilai = require("../controllers/Nilai.js")
const siswa = require("../controllers/Siswa.js")
const { getMapel, getMapelId, editMapel, hapusMapel, tambahMapel, getMapelKelas, getMapelRapor, getMapelCountKelas } = require("../controllers/Mapel.js")
const rapor = require("../controllers/Rapor.js")
const mapel = require("../controllers/NamaMapel.js")
const tahun = require("../controllers/TahunAjar.js")

const router = express.Router()

// User
router.get('/users', verifyToken, getUsers)
router.get('/users/:id', verifyToken, getUsersId)
router.get('/users/super/:super', getSuper)
router.put('/users/:id', UpdateUser)
router.put('/usersEmail/:id', UpdateEmail)
router.put('/usersPass/:id', UpdatePass)
router.put('/usersProfile/:id', UpdateProfil)
router.post('/users', Register)
router.delete('/users/:id', DeleteUser)
router.post('/login', Login)
router.get('/token', refreshToken)
router.delete('/logout', Logout)

// Guru
router.get('/guru', verifyToken, guru.getGurus)
router.get('/guruSearch', verifyToken, guru.getSearchGurus)
router.get('/guru/:id', verifyToken, guru.getGurusId)
router.get('/guru/nama/:nama', verifyToken, guru.getGurusName)
router.post('/guru', guru.TambahGuru)
router.put('/guru/:id', guru.editGuru)
router.put('/guruUpdate/:id', guru.updateGuru)
router.put('/guruRole/:id', guru.editGuruRole)
router.put('/guruUsername/:id', guru.UpdateUsername)
router.put('/guruPass/:id', guru.UpdatePass)
router.put('/guruProfile/:id', guru.UpdateProfil)
router.delete('/guru/:id', guru.hapusGuru)
router.get('/tokenGuru', refreshTokenGuru)
router.post('/loginGuru', guru.Login)
router.delete('/logoutGuru', guru.Logout)

// Kelas
router.get('/kelas', verifyToken, kelas.getKelas)
router.get('/kelasGuru/:idGuru', verifyToken, kelas.getKelasGuru)
router.get('/kelas/:id', verifyToken, kelas.getKelasId)
router.get('/kelasProgres/progres', kelas.getProgresKelas)
router.get('/kelasSearch', verifyToken, kelas.getKelasSearchGuru)
router.post('/kelas', kelas.tambahKelas)
router.put('/kelas/:id', kelas.editKelas)
router.delete('/kelas/:id', kelas.hapusKelas)

// Nilai
router.get('/nilai', verifyToken, nilai.getNilai)
router.get('/nilai/:id', verifyToken, nilai.getNilaiId)
router.get('/nilai/idSiswa/:idSiswa/:idKelas', verifyToken, nilai.getNilaiIdSiswa)
router.get('/nilai/countNilai/:idSiswa/:idKelas', verifyToken, nilai.getCountNilaiIdSiswa)
router.post('/nilai', nilai.tambahNilai)
router.put('/nilai/:id', nilai.editNilai)
router.delete('/nilai/:id', nilai.hapusNilai)

// Siswa
router.get('/siswa', verifyToken, siswa.getSiswa)
router.get('/siswaRecent', verifyToken, siswa.getSiswaRecent)
router.get('/siswa/:id', verifyToken, siswa.getSiswaId)
router.get('/siswaKelas/:idKelas', verifyToken, siswa.getSiswaIdKelas)
router.get('/siswaSearch', verifyToken, siswa.getSearchSiswa)
router.get('/siswaPage', verifyToken, siswa.getPageSiswa)
router.post('/siswa', siswa.tambahSiswa)
router.put('/siswa/:id', siswa.editSiswa)
router.delete('/siswa/:id', siswa.hapusSiswa)

// Mapel
router.get('/mapel', verifyToken, getMapel)
router.get('/mapel/:id', verifyToken, getMapelId)
router.get('/mapelKelas/:idKelas', verifyToken, getMapelKelas)
router.post('/mapel', tambahMapel)
router.put('/mapel/:id', editMapel)
router.delete('/mapel/:id', hapusMapel)


// Nama Mapel
router.get('/namaMapel', verifyToken, mapel.getNamaMapel)
router.get('/namaMapel/:nama', verifyToken, mapel.getNamaMapelNama)
router.get('/namaMapelId/:id', verifyToken, mapel.getNamaMapelId)
router.post('/namaMapel', mapel.tambahNamaMapel)
router.put('/namaMapel/:id', mapel.editNamaMapel)
router.delete('/namaMapel/:id', mapel.hapusNamaMapel)

// Rapor
router.get('/rapor', verifyToken, rapor.getRapor)
router.get('/rapor/:id', verifyToken, rapor.getRaporId)
router.get('/rapor/:idKelas/:idSiswa/:semester/:jenisR', verifyToken, rapor.getRaporIdSiswa)
router.post('/rapor', rapor.tambahRapor)
router.put('/rapor/:id', rapor.editRapor)
router.delete('/rapor/:id', rapor.hapusRapor)

// Tahun Ajar

router.get('/tahunAjar', verifyToken, tahun.getTahun)
router.get('/tahunAjar/:tahun/:tahun2', verifyToken, tahun.getTahunId)
router.post('/tahunAjar', tahun.tambahTahun)
router.put('/tahunAjar/:id', tahun.updateTahun)
router.delete('/tahunAjar/:id', tahun.deleteTahun)


module.exports = router