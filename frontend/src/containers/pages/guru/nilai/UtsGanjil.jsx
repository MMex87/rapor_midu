import React, { useEffect, useState } from 'react'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import ActionType from '../../../../redux/reducer/globalActionType'
import Swal from 'sweetalert2'

export const UtsGanjil = (props) => {
    // alert
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#343a40'
    })


    // Deklarasi params, jenis_nilai dan axios
    const params = useParams()
    const axiosJWT = axios.create()
    const navigate = useNavigate()
    const jenisRapor = 'UTS'
    const Semester = 'Ganjil'

    // state data
    const [siswa, setSiswa] = useState([])
    const [kelas, setKelas] = useState([])
    const [idKelas, setIdKelas] = useState('')
    const [idSiswa, setIdSiswa] = useState('')
    const [idNilai, setIdNilai] = useState('')
    const [idRapor, setIdRapor] = useState('')
    const [nilai, setNilai] = useState([])
    const [inputNilai, setInputNilai] = useState('')
    const [inputNilaiKet, setInputNilaiKet] = useState('')
    const [rapor, setRapor] = useState([])



    // state handle
    const [visi, setVisi] = useState('')
    const [visi2, setVisi2] = useState('d-none')


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
            return navigate('/login')
        }
    }

    // get Datas

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

    const getKelas = async () => {
        try {
            const response = await axiosJWT.get(`/kelas`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setKelas(response.data)
        } catch (error) {
            console.log(error);
        }
    }
    const getNilai = async () => {
        const response = await axiosJWT.get(`/nilai`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        setNilai(response.data)
    }

    const getRapor = async () => {
        try {
            const response = await axiosJWT.get('/rapor', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setRapor(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    // Handle
    // Handle tambah nilai
    const handleTambah = async (val) => {
        setVisi('d-none')
        setVisi2('')
        setIdSiswa(val)
        const response = await axiosJWT.get(`/rapor/${idKelas}/${val}/${Semester}/${jenisRapor}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        setIdRapor(response.data[0].id)
    }
    const handleEdit = async (val) => {
        setVisi('d-none')
        setVisi2('')
        setIdSiswa(val)
        const n = nilai.find(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == val && id_mapel == params.idMapel && jenis_rapor == jenisRapor && semester == Semester)
        setInputNilai(n.nilai)
        setInputNilaiKet(n.nilai_keterampilan)
        setIdNilai(n.id)
        setIdRapor(n.id_rapor)
    }
    const handleBack = () => {
        setVisi('')
        setVisi2('d-none')
        setIdSiswa('')
        setInputNilai('')
        setInputNilaiKet('')
        setIdNilai('')
        setIdRapor('')
    }

    // Handle data
    const handleData = async () => {
        try {
            const response = await axiosJWT.get(`/mapel/${params.idMapel}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setIdKelas(response.data.id_kelas)
        } catch (error) {
            console.log(error)
        }
    }


    const Tambah = async (e) => {
        e.preventDefault()
        try {
            if (idNilai) {
                await axios.put(`/nilai/${idNilai}`, {
                    nilai: inputNilai,
                    nilai_keterampilan: inputNilaiKet
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Nilai Berhasil di Update!!'
                })
            } else {
                await axios.post('/nilai', {
                    nilai: inputNilai,
                    nilai_keterampilan: inputNilaiKet,
                    id_mapel: params.idMapel,
                    id_siswa: idSiswa,
                    id_rapor: idRapor
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Nilai Berhasil di Tambah!!'
                })
            }
            setVisi('')
            setVisi2('d-none')
            getSiswa()
            getNilai()
            setInputNilai('')
            setInputNilaiKet('')
            setIdNilai('')
            setIdRapor('')
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        refreshToken()
        handleData()
        getSiswa()
        getKelas()
        getNilai()
        getRapor()
    }, [params.idMapel])

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
        <div className='position-relative p-2' style={ { height: 500 } }>
            <div className={ visi }>
                <table className="table table-hover table-dark text-nowrap position-absolute table-bordered" >
                    <thead>
                        <tr className='container'>
                            <th rowspan="2" style={ { width: '5%', textAlign: 'center', verticalAlign: 'middle' } }>No</th>
                            <th rowspan="2" style={ { width: '40%', textAlign: 'center', verticalAlign: 'middle' } }>Nama Siswa</th>
                            <th colspan="2" style={ { width: '20%', textAlign: 'center' } }>Pengetahuan</th>
                            <th colspan="2" style={ { width: '20%', textAlign: 'center' } }>Keterampilan</th>
                            <th rowspan="2" style={ { width: '15%', textAlign: 'center', verticalAlign: 'middle' } }>Aksi</th>
                        </tr>
                        <tr className='container'>
                            <th style={ { width: '7%', textAlign: 'center' } }>Nilai</th>
                            <th style={ { width: '13%', textAlign: 'center' } }>Predikat</th>
                            <th style={ { width: '7%', textAlign: 'center' } }>Nilai</th>
                            <th style={ { width: '13%', textAlign: 'center' } }>Predikat</th>
                        </tr>
                    </thead>
                    <tbody>
                        { siswa.filter(({ id_kelas }) => id_kelas == idKelas).map((val, index) => (
                            <tr key={ index }>
                                <td>{ index + 1 }</td>
                                <td>{ val.nama }</td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == val.id && id_mapel == params.idMapel && jenis_rapor == jenisRapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                { value.nilai }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == val.id && id_mapel == params.idMapel && jenis_rapor == jenisRapor && semester == Semester).map((value, index) => (
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
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == val.id && id_mapel == params.idMapel && jenis_rapor == jenisRapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                { value.nilai_keterampilan }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td style={ { textAlign: 'center' } }>
                                    {
                                        nilai.filter(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == val.id && id_mapel == params.idMapel && jenis_rapor == jenisRapor && semester == Semester).map((value, index) => (
                                            <div key={ index }>
                                                {
                                                    (89 < parseInt(value.nilai_keterampilan)) ? ('A') : (79 < parseInt(value.nilai_keterampilan)) ? ('B') : (69 < parseInt(value.nilai_keterampilan)) ? ('C') : ('D')
                                                }
                                            </div>
                                        ))
                                    }
                                </td>
                                <td className='d-flex justify-content-around'>
                                    <div key={ index } className='me-5'>
                                        {
                                            rapor.find(({ id_kelas, id_siswa, semester, jenis_rapor }) => id_siswa == val.id && id_kelas == idKelas && jenis_rapor == jenisRapor && semester == Semester) != null
                                                ?
                                                nilai.find(({ id_siswa, id_mapel, jenis_rapor, semester }) => id_siswa == val.id && id_mapel == params.idMapel && jenis_rapor == jenisRapor && semester == Semester) == null
                                                    ? <button type='button' className='btn btn-success' onClick={ () => handleTambah(val.id) }>
                                                        Tambah Nilai
                                                    </button>
                                                    : <button type='button' className='btn btn-warning' onClick={ () => handleEdit(val.id) }>
                                                        Edit
                                                    </button>
                                                : 'Permention WaliKelas'
                                        }
                                    </div>
                                </td>
                            </tr>
                        )) }
                    </tbody>
                </table>
            </div>
            <div className={ visi2 }>
                <div className='card position-absolute' style={ { width: '99%' } }>
                    <div className="card-header row">
                        <h3 className="card-title col-4">Tambah Nilai</h3>
                    </div>
                    <div className="row p-5">
                        <div className="col-md-10" >
                            <div className="form-group">
                                <form onSubmit={ Tambah }>
                                    <div className='mt-3'>
                                        <label>Nilai Pengetahuan</label>
                                        <input type="number" className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setInputNilai(e.target.value) } value={ inputNilai } min='0' max='100' maxlength="4" />
                                    </div>
                                    <div className='mt-3'>
                                        <label>Nilai Keterampilan</label>
                                        <input type="number" className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setInputNilaiKet(e.target.value) } value={ inputNilaiKet } min='0' max='100' maxlength="4" />
                                    </div>
                                    <div className='mt-5 d-flex justify-content-end row container'>
                                        <div className='col-sm-1'>
                                            <button className='btn btn-success'>
                                                Save
                                            </button>
                                        </div>
                                        <div className='col-sm-1'>
                                            <button className='btn btn-warning' onClick={ () => handleBack() }>
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(UtsGanjil)