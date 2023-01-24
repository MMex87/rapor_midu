import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import TambahNamaMapel from './TambahNamaMapel'

const Mapel = (props) => {
    // alert
    const Toast = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    // deklarasi hooks dan axios
    const navigate = useNavigate()
    const axiosJWT = axios.create()

    // state 
    const [mapel, setMapel] = useState([])
    const [kelas, setKelas] = useState([])
    const [guru, setGuru] = useState([])

    const [handle, setHandle] = useState(false)

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
                return navigate('/kepala/mapel')
            }
        } catch (error) {
            return navigate('/')
        }
    }

    // Get Datas
    const getMapel = async () => {
        try {
            const response = await axiosJWT.get('/mapel', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setMapel(response.data)
        } catch (error) {
            console.error(error);
        }
    }
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
    const getGuru = async () => {
        try {
            const response = await axiosJWT.get(`/guru`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setGuru(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    // handle delete

    const handleDelete = async (val, val2) => {
        try {
            const response = await axiosJWT.get(`/guru/${val2}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            let jtm = parseInt(response.data.jtm) - 2

            Toast.fire({
                title: 'Apa Kamu Yakin?',
                text: "Kamu akan Menghapus Data Mapel!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok, Hapus!',
                cancelButtonText: 'Tidak, Batal!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Toast.fire(
                        'Terhapus!',
                        'Data Mapel Sudah Terhapus.',
                        'success'
                    ).then((res) => {
                        if (res.isConfirmed)
                            setHandle(false)
                    })
                    axios.put(`/guru/${val2}`, {
                        jtm
                    })

                    axios.delete(`/mapel/${val}`)
                    setHandle(true)
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Toast.fire(
                        'Dibatalkan',
                        'Data Mapel tetap aman :)',
                        'error'
                    )
                }
            })
        } catch (error) {
            console.error(error);
        }
    }


    // Hooks Use Effect
    useEffect(() => {
        refreshToken()
        getMapel()
        getGuru()
        getKelas()
    }, [handle == true])


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
                                <h1 className="m-0">Mata Pelajaran</h1>
                            </div>{/* /.col */ }
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to={ "/dashboard" }>Dashboard</Link></li>
                                    <li className="breadcrumb-item active">Mapel</li>
                                </ol>
                            </div>{/* /.col */ }
                        </div>{/* /.row */ }
                    </div>{/* /.container-fluid */ }
                </div>
                <TambahNamaMapel />
                { kelas.filter(({ tahun_ajar }) => tahun_ajar == props.tahun_ajar).map((isi, v) => (
                    <div className="container-fluid" key={ v }>
                        {/* /.row */ }
                        <div className="row">
                            <div className="col-12">
                                <div className="card collapsed-card">
                                    <div className="card-header row">
                                        <h3 className="card-title col-4">Kelas { isi.kelas + isi.nama_kelas }</h3>
                                        <div className="col-5"></div>
                                        <div className="col-2 d-flex justify-content-end">
                                            <Link type='button' className='btn btn-success btn-sm' to={ `tambah/${isi.id}` }>
                                                Tambah <i class="fa-solid fa-plus"></i>
                                            </Link>
                                        </div>
                                        <div className="col-1 d-flex justify-content-end card-tools">
                                            <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-plus"></i>
                                            </button>
                                            <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* /.card-header */ }
                                    <div className="card-body table-responsive p-0" style={ { height: 500 } }>
                                        <table className="table table-hover table-dark text-nowrap position-absolute">
                                            <thead>
                                                <tr>
                                                    <th>Mata Pelajaraan</th>
                                                    <th>Induk</th>
                                                    <th>KKM</th>
                                                    <th>Guru</th>
                                                    <th>Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { mapel.map((val, index) => (
                                                    isi.id == val.id_kelas ?
                                                        <tr key={ index }>
                                                            <td className='col-4'>{ val.nama }</td>
                                                            <td className='col-2'>{ val.induk }</td>
                                                            <td className='col-1'>{ val.kkm }</td>
                                                            {
                                                                guru.map((value) => (
                                                                    val.idGuru == value.id ?
                                                                        <td className='col-2'>
                                                                            {
                                                                                value.nama
                                                                            }
                                                                        </td> : ''
                                                                ))
                                                            }
                                                            <td className='d-flex justify-content-around'>
                                                                <div className='me-5'>
                                                                    <Link type='button' className='btn btn-warning' to={ `edit/${val.id}` }>
                                                                        Edit
                                                                    </Link>
                                                                </div>
                                                                <div className='ms-5'>
                                                                    <button type='button' className='btn btn-danger' onClick={ () => { handleDelete(val.id, val.idGuru) } }>
                                                                        Hapus
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        : ''
                                                ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* /.card-body */ }
                                </div>
                                {/* /.card */ }
                            </div>
                        </div>
                    </div>
                )) }
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


export default connect(mapStateToProps, mapDispatchToProps)(Mapel)