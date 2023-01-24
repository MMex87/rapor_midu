import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'


export const TambahSiswa = (props) => {
    // alert
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#343a40'
    })


    // deklarasi hooks dan axios
    const navigate = useNavigate()
    const axiosJWT = axios.create()

    // state 
    const [msg, setMsg] = useState('')
    const [nama, setNama] = useState('')
    const [nis, setNis] = useState('')
    const [nisn, setNisn] = useState('')
    const [tanggal_lahir, setTanggal] = useState('')
    const [jenis_kelamin, setJenis] = useState('')
    const [id_kelas, setIdKelas] = useState('')
    const [kelas, setKelas] = useState([])

    // refresh Token
    const refreshToken = async () => {
        try {
            const response = await axios.get('/token')
            props.handleToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            props.handleName(decoded.name)
            props.handleExp(decoded.exp)
            props.handlePicture(decoded.picture)
            props.handleRole(decoded.role)
            props.handleTahunAjar(decoded.tahun)
            if (decoded.role == "Kepala Sekolah") {
                return navigate('/kepala/siswa')
            }
        } catch (error) {
            return navigate('/')
        }
    }


    // Datas
    const getKelas = async () => {
        try {
            const response = await axiosJWT.get('/kelas', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setKelas(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    // handle Tambah

    const tambah = async (e) => {
        e.preventDefault()
        try {
            if (nama == "" || nis == '' || nisn == '' || tanggal_lahir == '' || jenis_kelamin == '' || id_kelas == '') {
                Toast.fire({
                    icon: 'warning',
                    title: 'Tolong Isi dengan Lengkap',

                })
            } else {
                const status = 'aktiv'
                await axios.post('/siswa', {
                    nis, nisn, nama, tanggal_lahir, jenis_kelamin, status, id_kelas
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Data Berhasil di Tambahkan!',

                })
                navigate('/siswa')
            }
        } catch (error) {
            console.error(error);
        }

    }

    // Hooks Use Effect
    useEffect(() => {
        refreshToken()
        getKelas()
    }, [])

    // axios Interceptors 
    axiosJWT.interceptors.request.use(async (config) => {
        const currenDate = new Date()
        if (props.expired * 1000 < currenDate.getTime()) {
            const response = await axios.get('/token')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            props.handleToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            props.handleExp(decoded.exp)
            props.handleName(decoded.name)
            props.handlePicture(decoded.picture)
            props.handleRole(decoded.role)
            props.handleTahunAjar(decoded.tahun)
        }
        return config
    })

    return (
        <div>
            <div className="content-wrapper">
                {/* Content Header (Page header) */ }
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Siswa</h1>
                            </div>{/* /.col */ }
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to={ "/dashboard" }>Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to={ "/siswa" }>Siswa</Link></li>
                                    <li className="breadcrumb-item active">Tambah Siswa</li>
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
                                    <h3 className="card-title col-4">Tambah Data Siswa</h3>
                                    <div className="col-6"></div>
                                    <div className="col-2 d-flex justify-content-end">
                                        <Link type='button' className='btn btn-warning btn-sm' to={ `/siswa` }>
                                            Kembali <i className="fa-solid fa-rotate-left"></i>
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-2">
                                    <div className="col-md-10">
                                        <div className="form-group">
                                            <form onSubmit={ tambah }>
                                                <div>
                                                    <b className='text text-danger'>{ msg }</b>
                                                </div>
                                                <div>
                                                    <label>Nama Siswa</label>
                                                    <input type="text" id='name' className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setNama(e.target.value) } />
                                                </div>
                                                <div className='mt-3'>
                                                    <label>NIS</label>
                                                    <input type="number" id='id' className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setNis(e.target.value) } />
                                                </div>
                                                <div className='mt-3'>
                                                    <label>NISN</label>
                                                    <input type="number" id='id' className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setNisn(e.target.value) } />
                                                </div>
                                                <div className='mt-3'>
                                                    <label>Tanggal Lahir</label>
                                                    <input type="date" className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setTanggal(e.target.value) } />
                                                </div>
                                                <div className='mt-3'>
                                                    <label>Jenis Kelamin</label>
                                                    <select className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setJenis(e.target.value) }>
                                                        <option selected value="">-- Pilih Jenis Kelamin --</option>
                                                        <option value="Laki-Laki">Laki-Laki</option>
                                                        <option value="Perempuan">Perempuan</option>
                                                    </select>
                                                </div>
                                                <div className='mt-3'>
                                                    <label>Kelas</label>
                                                    <select className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setIdKelas(e.target.value) }>
                                                        <option selected value="">-- Pilih Kelas --</option>
                                                        { kelas.map((val) => (
                                                            <option value={ val.id }>{ val.kelas + val.nama_kelas }</option>
                                                        )) }
                                                    </select>
                                                </div>
                                                <div className='mt-5 d-flex justify-content-end'>
                                                    <button className='btn btn-success'>
                                                        Save
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TambahSiswa)