import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'

export const EditMapel = (props) => {

    // alert
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#343a40'
    })

    // Deklarasi Hooks, params, dan axios
    const navigate = useNavigate()
    const params = useParams()
    const axiosJWT = axios.create()


    // state data
    const [id_NMapel, setIdMapel] = useState('')
    const [kkm, setKkm] = useState('')
    const [idGuru, setIdGuru] = useState('')
    const [guru, setGuru] = useState([])
    const [mapel, setMapel] = useState([])
    const [dataMapel, setDataMapel] = useState([])

    // state message
    const [msg, setMsg] = useState('')

    // menampung Data Id Kelas
    const id_mapel = params.idMapel


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
            // console.error(error);
        }
    }

    // get Datas
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
    const getMapel = async (val) => {
        try {
            const response = await axiosJWT.get(`/mapel/${val}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setMapel(response.data)
            setIdMapel(response.data.id_NMapel)
            setKkm(response.data.kkm)
            setIdGuru(response.data.idGuru)
        } catch (err) {
            console.error(err)
        }
    }
    const getNamaMapel = async () => {
        try {
            const response = await axiosJWT.get(`/namaMapel`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setDataMapel(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    // handle Tambah Data
    const Edit = async (e) => {
        e.preventDefault()
        console.log(mapel.id_NMapel);
        console.log(id_NMapel);
        try {
            if (id_NMapel == mapel.id_NMapel) {
                await axios.put(`/mapel/${id_mapel}`, {
                    kkm, idGuru
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Berhasil Mengubah Data!',

                })
                navigate('/mapel')
            }
            else {
                await axios.put(`/mapel/${id_mapel}`, {
                    kkm, idGuru, id_NMapel
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Berhasil Mengubah Data!',

                })
                navigate('/mapel')
            }
        } catch (err) {
            if (err.response)
                Toast.fire({
                    icon: 'warning',
                    title: err.response.data.msg,
                })
            else
                console.log(err)
        }
    }


    // hooks use effect
    useEffect(() => {
        refreshToken()
        getGuru()
        getNamaMapel()
        return () => {
            getMapel(id_mapel)
        }
    }, [])


    // axios interceptors
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
                                    <li className="breadcrumb-item"> <Link to={ "/mapel" }>Mapel</Link></li>
                                    <li className="breadcrumb-item active">EditMapel</li>
                                </ol>
                            </div>{/* /.col */ }
                        </div>{/* /.row */ }
                    </div>{/* /.container-fluid */ }
                </div>
                {/* /.content-header */ }
                <div className="container-fluid">
                    {/* /.row */ }
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header row">
                                    <h3 className="card-title col-4">Edit Mapel</h3>
                                    <div className="col-6"></div>
                                    <div className="col-2 d-flex justify-content-end">
                                        <Link type='button' className='btn btn-warning btn-sm' to={ '/mapel' }>
                                            Kembali <i className="fa-solid fa-rotate-left"></i>
                                        </Link>
                                    </div>
                                </div>
                                {/* /.card-header */ }
                                <div className="card-body table-responsive p-2">
                                    <div className="col-md-10">
                                        <div className="form-group">
                                            <form onSubmit={ Edit }>
                                                <div>
                                                    <b className='text text-danger'>{ msg }</b>
                                                </div>
                                                <div>
                                                    <label>Nama Mapel</label>
                                                    <select className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setIdMapel(e.target.value) }>
                                                        <option selected value={ '' }>-- Pilih Mapel --</option>
                                                        {
                                                            dataMapel.map((val, index) => (
                                                                <option selected={ mapel.nama == val.nama ? 'selected' : '' } value={ val.id } key={ index }>{ val.nama }</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className='mt-3'>
                                                    <label>KKM</label>
                                                    <input type='number' className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setKkm(e.target.value) } value={ kkm } />
                                                </div>
                                                <div className='mt-3'>
                                                    <label>Nama Guru</label>
                                                    <select className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setIdGuru(e.target.value) }>
                                                        <option selected value={ '' }>-- Pilih Guru --</option>
                                                        { guru.map((val) => (
                                                            <option selected={ mapel.idGuru == val.id ? 'selected' : '' } value={ val.id }>{ val.nama }</option>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditMapel)