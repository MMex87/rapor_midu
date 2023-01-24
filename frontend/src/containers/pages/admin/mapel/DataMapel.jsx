import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import TambahNamaMapel from './TambahNamaMapel'

const DataMapel = (props) => {
    // alert
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#343a40'
    })
    const Toast2 = Swal.mixin({
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
    const [idMapel, setIdMapel] = useState('')
    const [nama, setNamaMapel] = useState('')
    const [induk, setInduk] = useState('')
    const [mapel, setMapel] = useState([])

    // handle
    const [visi, setVisi] = useState(false)
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
            const response = await axiosJWT.get('/namaMapel', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setMapel(response.data)
        } catch (error) {
            console.error(error);
        }
    }
    // handle Edit
    const handleEdit = async (val) => {
        const response = await axiosJWT.get(`/namaMapelId/${val}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        setNamaMapel(response.data.nama)
        setInduk(response.data.induk)
        setIdMapel(val)
        setVisi(!visi)
    }
    const handleBack = async () => {
        setNamaMapel('')
        setInduk('')
        setIdMapel('')
        setVisi(!visi)
    }

    const Edit = async (e) => {
        e.preventDefault()
        try {
            const data = await axiosJWT.get(`/namaMapel/${nama}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            if (data.data.nama == nama) {
                await axios.put(`/namaMapel/${idMapel}`, {
                    nama, induk
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Data Berhasil DiUbah!',

                })
                setVisi(!visi)
                setNamaMapel('')
                setInduk('')
                setIdMapel('')
            } else
                Toast2.fire({
                    icon: 'warning',
                    title: `Data ${data.data.nama} Sudah Ada!`,
                })
        } catch (err) {
            if (err.response) {
                if (nama === '' || induk === '') {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Tolong Isi dengan Lengkap',
                    })
                }
                else {
                    await axios.put('/namaMapel', {
                        nama, induk
                    })
                    Toast.fire({
                        icon: 'success',
                        title: 'Data Berhasil DiUbah!',

                    })
                    setVisi(!visi)
                    setNamaMapel('')
                    setInduk('')
                    setIdMapel('')
                }
            }
        }
    }

    // handle delete
    const handleDelete = async (val) => {
        try {
            Toast2.fire({
                title: 'Apa Kamu Yakin?',
                text: "Kamu akan Menghapus Data Mapel!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok, Hapus!',
                cancelButtonText: 'Tidak, Batal!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`/namaMapel/${val}`)
                        .then((result) => {
                            console.log(result)
                            if (result.status === 200) { // response - object, eg { status: 200, message: 'OK' }
                                console.log('success stuff');
                                Toast2.fire(
                                    'Terhapus!',
                                    'Data Mapel Sudah Terhapus.',
                                    'success'
                                ).then((res) => {
                                    if (res.isConfirmed)
                                        setHandle(false)
                                })

                                setHandle(true)
                                return true;
                            }
                        })
                        .catch(
                            (err) => {
                                console.log(err)
                            });

                    Toast2.fire(
                        'Gagal Terhapus!',
                        'Data Mapel Gagal Terhapus. Tolong Hapus Data Childern Terlebih Dahulu!',
                        'error'
                    ).then((res) => {
                        if (res.isConfirmed)
                            setHandle(false)
                    })
                    return false;
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Toast2.fire(
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
    }, [handle || visi])


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
                                    <li className="breadcrumb-item"><Link to={ "/mapel" }>Mapel</Link></li>
                                    <li className="breadcrumb-item active">Data Mapel</li>
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
                                    <h3 className="card-title col-4">Data Mata Pelajaran</h3>
                                    <div className="col-7"></div>
                                    <div className="col-1">
                                        {
                                            visi &&
                                            <button type='button' className='btn btn-warning btn-sm' onClick={ () => handleBack() }>Back</button>
                                        }
                                    </div>
                                </div>
                                {/* /.card-header */ }
                                {
                                    visi
                                        ?
                                        <div className={ "card-body p-5" } style={ { height: 300 } }>
                                            <div className="col-md-10">
                                                <div className="form-group">
                                                    <form onSubmit={ Edit }>
                                                        <div>
                                                            <label>Nama Mapel</label>
                                                            <input type='text' className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setNamaMapel(e.target.value) } value={ nama } />
                                                        </div>
                                                        <div className='mt-3'>
                                                            <label>Induk</label>
                                                            <select className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setInduk(e.target.value) }>
                                                                <option selected="selected" value={ '' }>-- Pilih Induk --</option>
                                                                <option selected={ induk == 'National' ? 'selected' : '' } value={ 'National' }>National</option>
                                                                <option selected={ induk == 'Pendidikan Agama' ? 'selected' : '' } value={ 'Pendidikan Agama' }>Pendidikan Agama</option>
                                                                <option selected={ induk == 'Muatan Lokal' ? 'selected' : '' } value={ 'Muatan Lokal' }>Muatan Lokal</option>
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
                                        :

                                        <div className={ "card-body table-responsive p-0" } style={ { height: 500 } }>
                                            <table className="table table-hover table-dark text-nowrap">
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Nama</th>
                                                        <th>Induk</th>
                                                        <th>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { mapel.map((val, index) => (
                                                        <tr key={ index }>
                                                            <td className='col-1'>{ index + 1 }</td>
                                                            <td className='col-4'>{ val.nama }</td>
                                                            <td className='col-2'>{ val.induk }</td>
                                                            <td className='d-flex justify-content-around'>
                                                                <div className='me-5'>
                                                                    <button type='button' className='btn btn-warning' onClick={ () => { handleEdit(val.id) } }>
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                                <div className='ms-5'>
                                                                    <button type='button' className='btn btn-danger' onClick={ () => { handleDelete(val.id) } }>
                                                                        Hapus
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                }
                                {/* /.card-body */ }
                            </div>
                            {/* /.card */ }
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


export default connect(mapStateToProps, mapDispatchToProps)(DataMapel)