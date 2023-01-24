import React, { useEffect, useState } from 'react'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import ActionType from '../../../../redux/reducer/globalActionType'
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import './style.css'

const DetailRapor = (props) => {
    // Deklarasi axios
    const axiosJWT = axios.create()
    const params = useParams()
    const Jenis_rapor = params.jenisR
    const Semester = params.semester


    // state data
    const [namaKelas, setNamaKelas] = useState('')
    const [nKelas, setNKelas] = useState('')
    const [namaSiswa, setNamaSiswa] = useState('')
    const [siswa, setSiswa] = useState([])
    const [guru, setGuru] = useState([])
    const [nilai, setNilai] = useState([])
    const [mapel, setMapel] = useState([])

    // state PDF
    const [nis, setNis] = useState('')
    const [nisn, setNisn] = useState('')
    const [idwali, setIdWali] = useState('')
    const [ajar, setAjar] = useState('')
    const [semester, setSemester] = useState('')

    let count = 0
    let count2 = 0



    // Refresh Token
    const refreshToken = async () => {
        try {
            const response = await axios.get('/tokenGuru')
            const decoded = jwt_decode(response.data.accessToken)
            const token = response.data.accessToken
            props.handleToken(token)
            props.handleName(decoded.nama)
            props.handleExp(decoded.exp)
            props.handlePicture(decoded.picture)
            props.handleRole(decoded.role)
            props.handleTahunAjar(decoded.tahun)
        } catch (error) {
            return navigate('/')
        }
    }

    // get Datas
    const handleData = async () => {
        try {
            const responseKelas = await axiosJWT.get(`/kelas/${params.idKelas}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setNamaKelas(responseKelas.data.nama_kelas)
            setNKelas(responseKelas.data.kelas)
            setIdWali(responseKelas.data.id_guru)

            const responseSiswa = await axiosJWT.get(`/siswa/${params.idSiswa}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setNamaSiswa(responseSiswa.data.nama)
            setNis(responseSiswa.data.nis)
            setNisn(responseSiswa.data.nisn)
            const responseRapor = await axiosJWT.get(`/rapor/${params.idKelas}/${params.idSiswa}/${Semester}/${Jenis_rapor}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setAjar(responseRapor.data[0].angkatan)
            setSemester(responseRapor.data[0].semester)
        } catch (error) {
            console.log(error)
        }
    }

    const getSiswa = async () => {
        try {
            const response = await axiosJWT.get(`/siswa`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setSiswa(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getGuru = async () => {
        try {
            const response = await axiosJWT.get(`/guru`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setGuru(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getMapel = async () => {
        const response = await axiosJWT.get(`/mapelKelas/${params.idKelas}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        setMapel(response.data.mapel)
    }

    const getNilai = async () => {
        const response = await axiosJWT.get(`/nilai`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        setNilai(response.data)
    }

    for (let i = 0; i < mapel.length; i++) {
        const idMapel = mapel[i].id
        for (let j = 0; j < nilai.length; j++) {
            try {
                count = count + nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == idMapel && jenis_rapor == Jenis_rapor && semester == Semester)[j].nilai
            } catch (error) {

            }
        }
    }
    for (let i = 0; i < mapel.length; i++) {
        const idMapel = mapel[i].id
        for (let j = 0; j < nilai.length; j++) {
            try {
                count2 = count2 + nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == idMapel && jenis_rapor == Jenis_rapor && semester == Semester)[j].nilai_keterampilan
            } catch (error) {

            }
        }
    }

    // console.log(namaMapel);
    // console.log(kkmMapel);

    // console.log(dataRapor)
    // handle PDF
    const handlePdf = () => {

        const walikelas = guru.filter(({ id }) => id == idwali)[0].nama


        // console.log(count);

        // Deklarasi PDF
        const doc = new jsPDF("l", "pt", "a4")


        doc.setFontSize(14)
        doc.text(`CAPAIAN HASIL BELAJAR`, 350, 50)
        doc.setFontSize(30)
        doc.text(`_______________________________________________`, 30, 80)
        doc.setFontSize(10)
        doc.text(`Nama`, 40, 100)
        doc.text(`:`, 120, 100)
        doc.text(`${namaSiswa}`, 150, 100)
        doc.text(`NIS`, 40, 120)
        doc.text(`:`, 120, 120)
        doc.text(`${nis}`, 150, 120)
        doc.text(`NISN`, 40, 140)
        doc.text(`:`, 120, 140)
        doc.text(`${nisn}`, 150, 140)
        doc.text(`Wali Kelas`, 450, 100)
        doc.text(`:`, 600, 100)
        doc.text(`${walikelas}`, 630, 100)
        doc.text(`Kelas / Semester`, 450, 120)
        doc.text(`:`, 600, 120)
        doc.text(`${nKelas + '.' + namaKelas + '/' + semester}`, 630, 120)
        doc.text(`Tahun Pembelajaran`, 450, 140)
        doc.text(`:`, 600, 140)
        doc.text(`${ajar}`, 630, 140)
        doc.setFontSize(30)
        doc.text(`_______________________________________________`, 30, 150)


        doc.autoTable(
            {
                html: '#my-table',
                useCss: true,
                includeHiddenHtml: true,
                startY: 170
            }
        )
        window.open(doc.output("bloburl"));
        // doc.save(`Data Kelas ${Nkelas}${namaKelas}.pdf`)
    }


    useEffect(() => {
        refreshToken()
        handleData()
        getSiswa()
        getGuru()
        getMapel()
        getNilai()
    }, [])

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date()
        if (props.expired * 1000 < currentDate.getTime()) {
            const response = await axios.get('/tokenGuru')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            props.handleToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            props.handleExp(decoded.exp)
            props.handleName(decoded.nama)
            props.handlePicture(decoded.picture)
            props.handleRole(decoded.role)
            props.handleTahunAjar(decoded.tahun)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    return (
        <div>
            <div className="content-wrapper">
                {/* Content Header (Page header) */ }
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">{ namaSiswa }</h1>
                            </div>{/* /.col */ }
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to={ "/dashboardGuru" }>Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to={ `/UserGuru/WaliKelas/${params.idKelas}` }>Kelas { nKelas + namaKelas }</Link></li>
                                    <li className="breadcrumb-item active">Rapor</li>
                                </ol>
                            </div>{/* /.col */ }
                        </div>{/* /.row */ }
                    </div>{/* /.container-fluid */ }
                </div>
                <div className="container-fluid">
                    {/* /.row */ }
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header row">
                                    <h3 className="card-title col-sm-4">Rapor</h3>
                                    <div className="col-sm-7 d-flex justify-content-end">
                                        <button type='button' className='btn btn-success' onClick={ () => handlePdf() }>
                                            <i className="fa-solid fa-file-arrow-down"></i> Save
                                        </button>
                                    </div>
                                    <div className="col-sm-1 d-flex justify-content-end">
                                        <div className="card-tools">
                                            <button type="button" className="btn btn-tool " data-card-widget="collapse">
                                                <i className="fas fa-minus" />
                                            </button>
                                        </div>
                                        <div className="card-tools me-5">
                                            <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-0" style={ { height: 500 } }>
                                    <table className="table table-hover table-dark text-nowrap position-absolute table-bordered">
                                        <thead>
                                            <tr className='container'>
                                                <th rowSpan={ 2 } style={ { width: '5%', textAlign: 'center', verticalAlign: 'middle' } }>No</th>
                                                <th rowSpan={ 2 } style={ { width: '25%', textAlign: 'center', verticalAlign: 'middle' } }>Mapel</th>
                                                <th rowSpan={ 2 } style={ { width: '25%', textAlign: 'center', verticalAlign: 'middle' } }>Guru</th>
                                                <th rowSpan={ 2 } style={ { width: '5%', textAlign: 'center', verticalAlign: 'middle' } }>KKM</th>
                                                <th colSpan={ 2 } style={ { width: '20%', textAlign: 'center' } }>Pengetahuan</th>
                                                <th colSpan={ 2 } style={ { width: '20%', textAlign: 'center' } }>Keterampilan</th>
                                            </tr>
                                            <tr className='container'>
                                                <th style={ { width: '7%', textAlign: 'center' } }>Nilai</th>
                                                <th style={ { width: '13%', textAlign: 'center' } }>Predikat</th>
                                                <th style={ { width: '7%', textAlign: 'center' } }>Nilai</th>
                                                <th style={ { width: '13%', textAlign: 'center' } }>Predikat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { mapel.map((val, index) => (
                                                <tr key={ index }>
                                                    <td>{ index + 1 }</td>
                                                    <td>{ val.nama }</td>
                                                    <td>
                                                        {
                                                            guru.filter(({ id }) => id == val.idGuru).map((value, indeks) => (
                                                                <div key={ indeks }>
                                                                    { value.nama }
                                                                </div>
                                                            ))
                                                        }
                                                    </td>
                                                    <td>{ val.kkm }</td>
                                                    <td style={ { textAlign: 'center' } }>
                                                        {
                                                            nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                                                <div key={ index }>
                                                                    { value.nilai }
                                                                </div>
                                                            ))
                                                        }
                                                    </td>
                                                    <td style={ { textAlign: 'center' } }>
                                                        {
                                                            nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                                                <div key={ index }>
                                                                    {
                                                                        (89 < parseInt(value.nilai)) ? ('A') : (79 < parseInt(value.nilai)) ? ('B') : (69 < parseInt(value.nilai)) ? ('C') : ('D')
                                                                    }
                                                                </div>
                                                            ))
                                                        }
                                                    </td>
                                                    <td style={ { textAlign: 'center' } }>
                                                        {
                                                            nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                                                <div key={ index }>
                                                                    { value.nilai_keterampilan }
                                                                </div>
                                                            ))
                                                        }
                                                    </td>
                                                    <td style={ { textAlign: 'center' } }>
                                                        {
                                                            nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                                                <div key={ index }>
                                                                    {
                                                                        (89 < parseInt(value.nilai_keterampilan)) ? ('A') : (79 < parseInt(value.nilai_keterampilan)) ? ('B') : (69 < parseInt(value.nilai_keterampilan)) ? ('C') : ('D')
                                                                    }
                                                                </div>
                                                            ))
                                                        }
                                                    </td>
                                                </tr>
                                            )) }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="table-hiden">
                <table className="d-none" id="my-table">
                    <thead>
                        <tr>
                            <th rowSpan={ 2 } style={ { width: '4%', verticalAlign: 'middle' } } className='no'>No</th>
                            <th rowSpan={ 2 } style={ { width: '66%', verticalAlign: 'middle' } } className='mapel'>Mata Pelajaran</th>
                            <th colSpan={ 2 } style={ { width: '15%' } } className='peng'>Pengetahuan</th>
                            <th colSpan={ 2 } style={ { width: '15%' } } className='ket'>Keterampilan</th>
                        </tr>
                        <tr>
                            <th style={ { width: '5%' } } className='np'>Nilai</th>
                            <th style={ { width: '10%' } } className='pp'>Predikat</th>
                            <th style={ { width: '5%' } } className='nk'>Nilai</th>
                            <th style={ { width: '10%' } } className='pk'>Predikat</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={ 6 } style={ { fontWeight: 'bold', textAlign: 'start', padding: 5 } }>Kelompok A(Umum)</td>
                        </tr>
                        <tr>
                            <td rowSpan={ mapel.filter(({ induk }) => induk == 'Pendidikan Agama').length + 1 }>1</td>
                            <td style={ { textAlign: 'start', padding: 5 } } colSpan={ 5 }>Pendidikan Agama Islam: </td>
                        </tr>
                        { mapel.filter(({ induk }) => induk == 'Pendidikan Agama').map((val, index) => (
                            <tr key={ index }>
                                <td style={ { textAlign: 'start', padding: 5 } }>
                                    { index + 1 + '. ' + val.nama }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                { value.nilai }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                {
                                                    (89 < parseInt(value.nilai)) ? ('A') : (79 < parseInt(value.nilai)) ? ('B') : (69 < parseInt(value.nilai)) ? ('C') : ('D')
                                                }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                { value.nilai_keterampilan }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                {
                                                    (89 < parseInt(value.nilai_keterampilan)) ? ('A') : (79 < parseInt(value.nilai_keterampilan)) ? ('B') : (69 < parseInt(value.nilai_keterampilan)) ? ('C') : ('D')
                                                }
                                            </div>
                                        ))
                                    }
                                </td>
                            </tr>
                        )) }
                        { mapel.filter(({ induk }) => induk == 'National').map((val, index) => (
                            <tr key={ index }>
                                <td>{ index + 2 }</td>
                                <td style={ { textAlign: 'start', padding: 5 } }>{ val.nama }</td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                { value.nilai }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                {
                                                    (89 < parseInt(value.nilai)) ? ('A') : (79 < parseInt(value.nilai)) ? ('B') : (69 < parseInt(value.nilai)) ? ('C') : ('D')
                                                }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                { value.nilai_keterampilan }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                {
                                                    (89 < parseInt(value.nilai_keterampilan)) ? ('A') : (79 < parseInt(value.nilai_keterampilan)) ? ('B') : (69 < parseInt(value.nilai_keterampilan)) ? ('C') : ('D')
                                                }
                                            </div>
                                        ))
                                    }
                                </td>
                            </tr>
                        )) }
                        <tr>
                            <td colSpan={ 6 } style={ { fontWeight: 'bold', textAlign: 'start', padding: 5 } }>Kelompok B(Umum)</td>
                        </tr>
                        <tr>
                            <td rowSpan={ mapel.filter(({ induk }) => induk == 'Muatan Lokal').length + 1 }>1</td>
                            <td style={ { textAlign: 'start', padding: 5 } } colSpan={ 5 }>Muatan Lokal *) </td>
                        </tr>
                        { mapel.filter(({ induk }) => induk == 'Muatan Lokal').map((val, index) => (
                            <tr key={ index }>
                                <td style={ { textAlign: 'start', padding: 5 } }> { index + 1 + '. ' + val.nama }</td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                { value.nilai }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                {
                                                    (89 < parseInt(value.nilai)) ? ('A') : (79 < parseInt(value.nilai)) ? ('B') : (69 < parseInt(value.nilai)) ? ('C') : ('D')
                                                }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                { value.nilai_keterampilan }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == params.idSiswa && id_mapel == val.id && jenis_rapor == Jenis_rapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                {
                                                    (89 < parseInt(value.nilai_keterampilan)) ? ('A') : (79 < parseInt(value.nilai_keterampilan)) ? ('B') : (69 < parseInt(value.nilai_keterampilan)) ? ('C') : ('D')
                                                }
                                            </div>
                                        ))
                                    }
                                </td>
                            </tr>
                        )) }
                        <tr>
                            <td style={ { textAlign: 'start', padding: 5 } } colSpan={ 2 }>Jumlah</td>
                            <td>{ count }</td>
                            <td></td>
                            <td>{ count2 }</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        name: state.user,
        token: state.token,
        expired: state.expired,
        picture: state.picture,
        role: state.role,
        tahun_ajar: state.tahun_ajar
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleName: (nama) => dispatch({ type: ActionType.SET_NAME_USER, index: nama }),
        handleToken: (token) => dispatch({ type: ActionType.SET_TOKEN_USER, index: token }),
        handleExp: (exp) => dispatch({ type: ActionType.SET_EXPIRED_USER, index: exp }),
        handlePicture: (pic) => dispatch({ type: ActionType.SET_PICTURE_USER, index: pic }),
        handleRole: (role) => dispatch({ type: ActionType.SET_ROLE_USER, index: role }),
        handleTahunAjar: (tahun) => dispatch({ type: ActionType.SET_TAHUN_AJAR, index: tahun })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailRapor)