import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'

const TambahNamaMapel = (props) => {
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

    // axios
    const axiosJWT = axios.create()

    // state data
    const [nama, setMapel] = useState('')
    const [induk, setInduk] = useState('')

    // state handle
    const [visi, setVisi] = useState(false)
    const [handle, setHandle] = useState(true)

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


    const handleBack = () => {
        setInduk('')
        setMapel('')
        setVisi(!visi)
        setHandle(!handle)
    }

    // Hooks Use Effect
    useEffect(() => {
        refreshToken()
    }, [])


    // handle Tambah Data
    const Tambah = async (e) => {
        e.preventDefault()
        try {
            const data = await axiosJWT.get(`/namaMapel/${nama}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })

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
                    await axios.post('/namaMapel', {
                        nama, induk
                    })
                    Toast.fire({
                        icon: 'success',
                        title: 'Data Berhasil Ditambahkan!',

                    })
                    setVisi(!visi)
                    setHandle(!handle)
                }
            }
        }
    }

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
        <>
            <div className="container-fluid">
                {/* /.row */ }
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header row">
                                <h3 className="card-title col-4">Tambah Mapel</h3>
                                <div className="col-6"></div>
                                <div className="col-1 d-flex justify-content-end">
                                    {
                                        handle
                                            ?
                                            <button type="button" class="btn btn-success btn-sm" onClick={ () => handleBack() }>Tambah
                                            </button>
                                            :
                                            <button type="button" class="btn btn-warning btn-sm" onClick={ () => handleBack() }>Back
                                            </button>
                                    }
                                </div>
                                <div className="col-1 d-flex justify-content-end">
                                    <Link className='btn btn-primary' to={ "dataMapel" }>
                                        Data
                                    </Link>

                                </div>
                            </div>
                            {
                                visi &&
                                (<div className={ "card-body p-5" } style={ { height: 300 } }>
                                    <div className="col-md-10">
                                        <div className="form-group">
                                            <form onSubmit={ Tambah }>
                                                <div>
                                                    <label>Nama Mapel</label>
                                                    <input type='text' className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setMapel(e.target.value) } />
                                                </div>
                                                <div className='mt-3'>
                                                    <label>Induk</label>
                                                    <select className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setInduk(e.target.value) }>
                                                        <option selected="selected" value={ '' }>-- Pilih Induk --</option>
                                                        <option value={ 'National' }>National</option>
                                                        <option value={ 'Pendidikan Agama' }>Pendidikan Agama</option>
                                                        <option value={ 'Muatan Lokal' }>Muatan Lokal</option>
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
                                </div>)
                            }
                        </div>

                        {/* /.card */ }
                    </div>
                </div>
            </div>
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(TambahNamaMapel)