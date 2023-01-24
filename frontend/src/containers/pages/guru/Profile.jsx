import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../redux/reducer/globalActionType'
import axios from '../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

export const Profile = (props) => {
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

    // deklarasi hooks dan axios
    const navigate = useNavigate()
    const axiosJWT = axios.create()

    const fileInput = React.createRef()

    // state
    const [userId, setUserId] = useState([])
    const [nama, setNama] = useState('')
    const [role, setRole] = useState('')
    const [jtm, setJtm] = useState('')
    const [username, setUsername] = useState('')
    const [namaButon, setNamaButton] = useState('Edit Profile')
    const [titlePassword, setTitlePassword] = useState('Password')
    const [respon, setResponse] = useState(false)

    // state Data
    const [inputUsername, setInputUsername] = useState('')
    const [inputPass, setInputPass] = useState('')
    const [inputPassLama, setInputPassLama] = useState('')
    const [inputConfPass, setInputConfPass] = useState('')


    // handle visible
    const [visi, setVisi] = useState(true)
    const [visiPass, setVisiPass] = useState(false)
    const [visiUsername, setVisiUsername] = useState(false)

    // state picture
    const [picture, setPicture] = useState('default.png')
    const [foto, setFoto] = useState('http://localhost:8076/assets/uploads/default.png')
    const [saveImage, setSaveImage] = useState(null)
    const [statusUp, setStatusUp] = useState(0)


    // refresh Token
    const refreshToken = async () => {
        try {
            const response = await axios.get('/tokenGuru')
            props.handleToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            props.handleName(decoded.nama)
            props.handleExp(decoded.exp)
            props.handlePicture(decoded.picture)
            props.handleRole(decoded.role)
            setUserId(decoded.userId)
            getUser(decoded.userId)
            props.handleTahunAjar(decoded.tahun)
            setJtm(decoded.jtm)
        } catch (error) {
            return navigate('/')
        }
    }

    // get Datas
    const getUser = async (val) => {
        const response = await axiosJWT.get(`/guru/${val}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        setNama(response.data.nama)
        setRole(response.data.role)
        setUsername(response.data.username)
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



    // Hooks Use Effect
    useEffect(() => {
        refreshToken()
    }, [respon])

    const handleEdit = () => {
        if (visi) {
            setNamaButton('Batal')
            setVisi(!visi)
        } else {
            setNamaButton('Edit Profile')
            setVisi(!visi)
        }
    }

    const handlePass = () => {
        setVisiPass(!visiPass)
        setInputPass('')
        setInputPassLama('')
        setInputConfPass('')
        if (visiPass)
            setTitlePassword('Password')
        else
            setTitlePassword('Password Lama')
    }
    const handleUsername = () => {
        setVisiUsername(!visiUsername)
        setInputUsername('')
    }

    const EditUsername = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`/guruUsername/${userId}`, {
                username: inputUsername
            })
            if (response.status == 200) {
                Toast.fire({
                    icon: 'success',
                    title: 'Berhasil Edit username'
                })
                setResponse(!respon)
                setVisiUsername(!visiUsername)
                setInputUsername('')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const EditPass = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`/guruPass/${userId}`, {
                password: inputPass, confPassword: inputConfPass, passwordLama: inputPassLama
            })
            if (response.status == 200) {
                Toast.fire({
                    icon: 'success',
                    title: 'Berhasil Edit Password'
                })
                setResponse(!respon)
                setVisiPass(!visiPass)
                setInputPass('')
                setInputPassLama('')
                setInputConfPass('')
            }
        } catch (error) {
            if (error.response) {
                Toast2.fire({
                    icon: 'warning',
                    title: error.response.data.msg
                })
            }
        }
    }

    const EditProfil = async (e) => {
        e.preventDefault()
        try {
            if (statusUp == 2 || statusUp == 0) {
                const response = await axios.put(`/guruProfile/${userId}`, {
                    picture
                })
                if (response.status == 200) {
                    Toast.fire({
                        icon: 'success',
                        title: 'Berhasil Edit Foto Profile'
                    })
                    setResponse(!respon)
                    setVisi(!visi)
                    if (visi) {
                        setNamaButton('Batal')
                        setVisi(!visi)
                    } else {
                        setNamaButton('Edit Profile')
                        setVisi(!visi)
                    }
                }
            } else {
                Toast2.fire({
                    icon: 'warning',
                    title: 'Tolong tekan Upload foto terlebih dahulu!!',

                })
            }
        } catch (error) {
            if (error.response) {
                Toast2.fire({
                    icon: 'warning',
                    title: error.response.data.msg
                })
            }
        }
    }

    // axios Interceptors 
    axiosJWT.interceptors.request.use(async (config) => {
        const currenDate = new Date()
        if (props.expired * 1000 < currenDate.getTime()) {
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
    })

    return (
        <div>
            <div className="content-wrapper">
                {/* Content Header (Page header) */ }
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Profile</h1>
                            </div>{/* /.col */ }
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to={ "/dashboardGuru" }>Dashboard</Link></li>
                                    <li className="breadcrumb-item active">Profile</li>
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
                                <div className="card-header">
                                    <div className="card-title container">
                                        <h3 className="d-flex justify-content-center">{ nama }</h3>
                                    </div>
                                </div>
                                <div className='row p-5 container'>
                                    <div className="card d-flex justify-content-center">
                                        <div className="card card-primary card-outline">
                                            <div className="card-body box-profile">
                                                <div className="text-center">
                                                    <img src={ 'http://localhost:8076/assets/uploads/' + props.picture } className="card-img-top img-fluid" style={ { width: '24rem' } } />
                                                </div>
                                                <h3 className="profile-username text-center mb-2">{ nama }</h3>
                                                <p className="text-muted text-center mb-3">{ role }</p>
                                                {
                                                    visi
                                                        ?
                                                        <>
                                                            <form onSubmit={ EditUsername }>
                                                                <ul className="list-group list-group-unbordered mb-3">
                                                                    <div className='container-sm'>
                                                                        <b className='ms-2'>Username </b>
                                                                    </div>
                                                                    <li className="list-group-item p-2 mb-3">
                                                                        {
                                                                            visiUsername
                                                                                ?
                                                                                <button type='button' className='btn btn-sm btn-primary' onClick={ () => handleUsername() }>Batal</button>
                                                                                :
                                                                                <button type='button' className='btn btn-sm btn-primary' onClick={ () => handleUsername() }>Edit</button>
                                                                        }
                                                                        <div className="float-right">
                                                                            {
                                                                                visiUsername
                                                                                    ?
                                                                                    <input type="text" onChange={ (e) => setInputUsername(e.target.value) } value={ inputUsername } className="form-control select2" />
                                                                                    :
                                                                                    <p>{ username }</p>
                                                                            }
                                                                        </div>
                                                                    </li>
                                                                    {
                                                                        visiUsername &&
                                                                        <div className="container">
                                                                            <button className='btn btn-success'>Save</button>
                                                                        </div>
                                                                    }
                                                                </ul>
                                                            </form>
                                                            <ul className="list-group list-group-unbordered mb-3">
                                                                <div className='container-sm'>
                                                                    <b className='ms-2'>JTM </b>
                                                                </div>
                                                                <li className="list-group-item p-2 mb-3">
                                                                    <div className="float-right">
                                                                        <b>{ jtm }</b>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                            <div className='container-sm'>
                                                                <b className='ms-2'>{ titlePassword } </b>
                                                            </div>
                                                            <form onSubmit={ EditPass }>
                                                                <ul className="list-group list-group-unbordered mb-3">
                                                                    <li className="list-group-item p-2 mb-3">
                                                                        {
                                                                            visiPass
                                                                                ?
                                                                                <button type='button' className='btn btn-sm btn-primary' onClick={ () => handlePass() }>Batal</button>
                                                                                :
                                                                                <button type='button' className='btn btn-sm btn-primary' onClick={ () => handlePass() }>Edit</button>
                                                                        }
                                                                        <div className="float-right">
                                                                            {
                                                                                visiPass
                                                                                    ?
                                                                                    <input type="password" onChange={ (e) => setInputPassLama(e.target.value) } value={ inputPassLama } className="form-control select2" />
                                                                                    :
                                                                                    <input type="password" value={ "skjtrew" }
                                                                                        className={ 'border-none' } disabled
                                                                                        style={ { backgroundColor: '#343a40', color: '#fff', textAlign: 'end' } } />
                                                                            }
                                                                        </div>
                                                                    </li>
                                                                    {
                                                                        visiPass &&
                                                                        <>
                                                                            <b>Password</b>
                                                                            <li className="list-group-item p-2 mb-3">
                                                                                <div className="float-right">
                                                                                    <input type="password" onChange={ (e) => setInputPass(e.target.value) } value={ inputPass } className="form-control select2" />
                                                                                </div>
                                                                            </li>
                                                                            <b>Konfirmasi Password</b>
                                                                            <li className="list-group-item p-2 mb-3">
                                                                                <div className="float-right">
                                                                                    <input type="password" onChange={ (e) => setInputConfPass(e.target.value) } value={ inputConfPass } className="form-control select2" />
                                                                                </div>
                                                                            </li>
                                                                        </>
                                                                    }
                                                                    {
                                                                        visiPass &&
                                                                        <div className="container">
                                                                            <button className='btn btn-success'>Save</button>
                                                                        </div>
                                                                    }
                                                                </ul>
                                                            </form>
                                                        </>
                                                        :
                                                        <ul className="list-group list-group-unbordered mb-3">
                                                            <li className="list-group-item p-2 mb-3">
                                                                <form onSubmit={ EditProfil }>
                                                                    <div className='mt-3 mb-5'>
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
                                                                    <div style={ { width: '100%' } } className={ 'mt-3 mb-3' }>
                                                                        <div className='d-flex justify-content-center'>
                                                                            <button className='btn btn-success'>Save</button>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </li>
                                                        </ul>
                                                }

                                                <button type='button' className="btn btn-primary btn-block" onClick={ () => handleEdit() }><b>{ namaButon }</b></button>
                                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile)