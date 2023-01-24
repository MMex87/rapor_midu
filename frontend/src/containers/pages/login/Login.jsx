import React, { useEffect, useState } from 'react'
import axios from "../../../api/axios"
import jwt_decode from 'jwt-decode'
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import './Login.css'

const Login = () => {

    // Toast
    let Toast = Swal.mixin({
        // toast: true,
        position: 'center',
        showConfirmButton: true,
        // timer: 3000
    });

    // State Data Login Admin
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // State Data Login Guru
    const [username, setUsername] = useState('')
    const [passwordGuru, setPasswordGuru] = useState('')
    // State Data Registrasi Super Admin
    const [name, setName] = useState('')
    const [emailReq, setEmailReq] = useState('')
    const [passwordReq, setPasswordReq] = useState('')
    const [confPassword, setConfPassword] = useState('')

    // state panel dan visibility
    const [panel, setPanel] = useState('')
    const [visi, setVisi] = useState('')
    const [visi2, setVisi2] = useState('d-none')

    const [msg, setMsg] = useState('')
    const [authStatus, setAuthStatus] = useState(0)
    const [authStatus2, setAuthStatus2] = useState(0)
    const navigate = useNavigate()


    const handleSingUp = () => {
        setPanel('right-panel-active')
        setEmail('')
        setPassword('')
    };

    const handleSingIn = () => {
        setPanel('')
        setUsername('')
        setPasswordGuru('')
    };

    const handleSingUpMobile = () => {
        setPanel('right-panel-active')
        setEmail('')
        setPassword('')
    };

    const handleSingInMobile = () => {
        setPanel('')
        setUsername('')
        setPasswordGuru('')
    };



    // refresh Token
    const authLogin = async () => {
        try {
            const response = await axios.get('/token')
            setAuthStatus(response.status)
        } catch (error) {
            setAuthStatus(error.response.status)
        }
    }

    const authLogin2 = async () => {
        try {
            const response = await axios.get('/tokenGuru')
            setAuthStatus2(response.status);
        } catch (error) {
            setAuthStatus2(error.response.status);
        }
    }


    // handle login
    const handleLogin = () => {
        handleRegister()
        if (authStatus == 200) {
            navigate('/dashboard')
        } else if (authStatus2 == 200) {
            navigate('/dashboardGuru')
        } else {
            navigate('/')
        }
    }

    // Auth Registrasi
    const handleRegister = async () => {
        try {
            const response = await axios.get('/users/super/Super Admin')
            if (response.data == null) {
                setVisi('d-none')
                setVisi2('')
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        authLogin()
        authLogin2()
        handleLogin()
    }, [authStatus || authStatus2])

    // handle Login dan Register
    const LoginAdmin = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/login', {
                email, password
            })
            const response = await axios.get('/token')
            const decoded = jwt_decode(response.data.accessToken)
            Toast.fire({
                icon: 'success',
                text: 'Berhasil Login',
                color: '#fff'
            }).then((result) => {
                if (decoded.role == 'Kepala Sekolah' && result.isConfirmed) {
                    navigate('/kepala/dashboard')
                } else if (result.isConfirmed) {
                    navigate('/dashboard')
                }
            })
        } catch (err) {
            if (err.response) {
                Toast.fire({
                    icon: 'error',
                    text: err.response.data.msg,
                    color: '#fff'
                })
                setMsg(err.response.data.msg)
            }
        }
    }

    const LoginGuru = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/loginGuru', {
                username, password: passwordGuru
            })
            Toast.fire({
                icon: 'success',
                text: 'Berhasil Login',
                color: '#fff'
            }).then((result) => {
                if (result.isConfirmed)
                    navigate('/dashboardGuru')
            })
        } catch (err) {
            if (err.response) {
                Toast.fire({
                    icon: 'error',
                    text: err.response.data.msg,
                    color: '#fff'
                })
                setMsg(err.response.data.msg)
            }
        }
    }

    const Register = async (e) => {
        e.preventDefault()
        const role = 'Super Admin'
        const picture = 'default.png'
        try {
            const response = await axios.post('/users', {
                name, email: emailReq, password: passwordReq, confPassword, role, picture
            })
            Toast.fire({
                icon: 'success',
                text: response.data.msg,
                color: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    setVisi('')
                    setVisi2('d-none')
                }
            })
        } catch (err) {
            if (err.response) {
                Toast.fire({
                    icon: 'error',
                    text: err.response.data.msg,
                    color: '#fff'
                })
            }
        }
    }


    return (
        <div className="login">
            <div className={ visi + " containers " + panel } id="containers">
                <div className="form-containers sign-up-containers">
                    <form onSubmit={ LoginGuru }>
                        <h1>Login Guru</h1>
                        <span>Gunakan Username untuk Login</span>
                        <input type="text" placeholder="Username" onChange={ (e) => setUsername(e.target.value) } value={ username } required />
                        <input type="password" placeholder="Password" onChange={ (e) => setPasswordGuru(e.target.value) } value={ passwordGuru } required />
                        <button>Sign In</button>
                        <p id="mobile_para">Jika belum punya akun Guru bisa Minta Akun ke Admin!!</p>
                        <button className="ghost_mobile" id="signIn_mobile" onClick={ () => handleSingInMobile() }>Login Admin</button>
                    </form>
                </div>
                <div className="form-containers sign-in-containers">
                    <form onSubmit={ LoginAdmin }>
                        <h1>Login Admin</h1>
                        <span>Gunakan Email untuk Login</span>
                        <input type="email" placeholder="Email" onChange={ (e) => setEmail(e.target.value) } value={ email } required />
                        <input type="password" placeholder="Password" onChange={ (e) => setPassword(e.target.value) } value={ password } required />
                        <button>Sign In</button>
                        <p id="mobile_para">Jika belum punya akun Admin bisa Minta Akun ke Super Admin!!</p>
                        <button className="ghost_mobile" id="signUp_mobile" onClick={ () => handleSingUpMobile() }>Login Guru</button>
                    </form>
                </div>
                <div className="overlay-containers">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Login Sebagai Admin</h1>
                            <p>Jika belum punya akun Guru bisa Minta Akun ke Admin!!</p>
                            <button className="ghost" id="signIn" onClick={ () => handleSingIn() }>Login Admin</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Login Sebagai Guru</h1>
                            <p>Jika belum punya akun Admin bisa Minta Akun ke Super Admin!!</p>
                            <button className="ghost" id="signUp" onClick={ () => handleSingUp() }>Login Guru</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={ "containers " + visi2 }>
                <div className="form-containers sign-in-containers">
                    <form onSubmit={ Register }>
                        <h1>Registrasi</h1>
                        <span>Isi dengan Lengkap</span>
                        <input type="text" placeholder="Nama" onChange={ (e) => setName(e.target.value) } value={ name } required />
                        <input type="email" placeholder="Email" onChange={ (e) => setEmailReq(e.target.value) } value={ emailReq } required />
                        <input type="password" placeholder="Password" onChange={ (e) => setPasswordReq(e.target.value) } value={ passwordReq } required />
                        <input type="password" placeholder="Confirm Password" onChange={ (e) => setConfPassword(e.target.value) } value={ confPassword } required />
                        <button>Sign Up</button>
                    </form>
                </div>
                <div className="overlay-containers">
                    <div className="overlay">
                        <div className="overlay-panel overlay-right">
                            <h1>Registrasi Super Admin</h1>
                            <p>Website ini Belum Memiliki Super Admin Untuk Mengelola Mastering data, mohon Registrasi Terlebih Dahulu</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login