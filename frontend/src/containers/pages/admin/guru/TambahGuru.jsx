import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'



export const TambahGuru = (props) => {
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
        toast: true,
        position: 'center',
        showConfirmButton: true,
        background: '#343a40'
    })


    const fileInput = React.createRef()

    // deklarasi hooks dan axios
    const navigate = useNavigate()
    const axiosJWT = axios.create()


    // state input
    const [nama, setNama] = useState('')
    const [nuptk, setNuptk] = useState('')
    const [tanggal_lahir, setTanggal] = useState('')
    const [pendidikan, setPendidikan] = useState('')
    const [jenis_kelamin, setJenis] = useState('')

    // state data
    const [guru, setGuru] = useState([])

    // state picture
    const [picture, setPicture] = useState('default.png')
    const [foto, setFoto] = useState('http://localhost:8076/assets/uploads/default.png')
    const [saveImage, setSaveImage] = useState(null)
    const [statusUp, setStatusUp] = useState(0)



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
                return navigate('/kepala/guru')
            }
        } catch (error) {
            return navigate('/')
        }
    }


    // Datas
    const getGuru = async () => {
        try {
            const response = await axiosJWT.get('/guru', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setGuru(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    // handle upload foto

    const handleFoto = () => {
        const uploaded = fileInput.current.files[0]
        setPicture(uploaded.name)
        setFoto(URL.createObjectURL(uploaded))
        setSaveImage(uploaded)
        setStatusUp(1)
    }

    const handleUploadFoto = async (e) => {
        e.preventDefault()
        // deklarasi form data
        const formData = new FormData()
        formData.append('photo', saveImage)

        if (statusUp == 0) {
            Toast2.fire({
                icon: 'warning',
                title: 'Tolong Pilih gambar Terlebih dalulu!!',

            })
        } else if (statusUp == 2) {
            Toast2.fire({
                icon: 'warning',
                title: 'Foto Sudah Tersimpan!!',

            })
        } else {
            await axios({
                method: "POST",
                url: '/img/uploads',
                data: formData,
            }).then((res) => {
                setFoto(res.data.image)
                setPicture(res.data.name)
                setStatusUp(2)
                Toast.fire({
                    icon: 'success',
                    title: 'Foto Berhasil di Upload!!',

                })
            }).catch((err) => {
                console.error(err)
            })
        }

    }

    // handle Tambah

    const tambah = async (e) => {
        e.preventDefault()

        // deklarasi jtm dan role
        const jtm = 0
        const role = 'Guru'

        try {
            if (nama == "" || nuptk == '' || tanggal_lahir == '' || jenis_kelamin == '') {
                Toast.fire({
                    icon: 'warning',
                    title: 'Tolong isi dengan Lengkap',

                })
            } else {
                if (statusUp == 2 || statusUp == 0) {
                    await axios.post('/guru', {
                        nama, jtm, nuptk, pendidikan, tanggal_lahir, jenis_kelamin, picture, role
                    })
                    setStatusUp(0)

                    // axios refresh token
                    refreshToken()

                    Toast.fire({
                        icon: 'success',
                        title: 'Berhasil di Tambahkan',

                    })

                    navigate('/guru')
                } else {
                    Toast2.fire({
                        icon: 'warning',
                        title: 'Tolong tekan Upload foto terlebih dahulu!!',

                    })
                }
            }
        } catch (error) {
            console.error(error);
        }

    }

    // Hooks Use Effect
    useEffect(() => {
        refreshToken()
        getGuru()
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
                                <h1 className="m-0">Guru</h1>
                            </div>{/* /.col */ }
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to={ "/dashboard" }>Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to={ "/guru" }>Guru</Link></li>
                                    <li className="breadcrumb-item active">Tambah Guru</li>
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
                                    <h3 className="card-title col-4">Tambah Data Guru</h3>
                                    <div className="col-6"></div>
                                    <div className="col-2 d-flex justify-content-end">
                                        <Link type='button' className='btn btn-warning btn-sm' to={ `/guru` }>
                                            Kembali <i className="fa-solid fa-rotate-left"></i>
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-2">
                                    <div className="col-md-10">
                                        <div className="form-group">
                                            <form onSubmit={ tambah }>
                                                <div>
                                                    <label>Nama Guru</label>
                                                    <input type="text" className="form-control select2" id='name' style={ { width: '100%' } } onChange={ (e) => setNama(e.target.value) } />
                                                </div>
                                                <div className='mt-3'>
                                                    <label>NUPTK</label>
                                                    <input type="number" className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setNuptk(e.target.value) } />
                                                </div>
                                                <div className='mt-3'>
                                                    <label>Tanggal Lahir</label>
                                                    <input type="date" className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setTanggal(e.target.value) } />
                                                </div>
                                                <div className='mt-3'>
                                                    <label>Pendidikan</label>
                                                    <input type="text" className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setPendidikan(e.target.value) } />
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
                                                    <label>Foto Profile</label>
                                                    <div className="w-25 mt-3 mb-3" style={ { marginLeft: 50 } }>
                                                        <img src={ foto } className='img-thumbnail'></img>
                                                    </div>
                                                    <div className="input-group">
                                                        <div className="custom-file">
                                                            <input type="file" className="custom-file-input" id="exampleInputFile" accept='image/*' onChange={ handleFoto } ref={ fileInput } />
                                                            <label className="custom-file-label" htmlFor="exampleInputFile">{ foto == 'http://localhost:8076/assets/uploads/default.png' ? 'Pilih Gambar' : picture }</label>
                                                        </div>
                                                        <div className="input-group-append">
                                                            <button type='button' className="input-group-text" onClick={ handleUploadFoto }>Upload</button>
                                                        </div>
                                                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TambahGuru)