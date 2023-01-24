import React, { useEffect, useState } from 'react'
import axios from "../../../api/axios"
import jwt_decode from 'jwt-decode'
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [username, setUname] = useState('')
    const [password, setPassword] = useState('')

    const [msg, setMsg] = useState('')
    const navigate = useNavigate()

    // refresh Token
    const AuthLogin = async () => {
        try {
            await axios.get('/tokenGuru')
            return navigate('/dashboardGuru')
        } catch (error) {
            return navigate('/login')
        }
    }


    useEffect(() => {
        AuthLogin()
    }, [])


    const Auth = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/loginGuru', {
                username, password
            })
            // const response = await axios.get('/token')
            // const decoded = jwt_decode(response.data.accessToken)
            // if (decoded.role == 'Kepala Sekolah') {
            //     navigate('/kepala/dashboardGuru')
            // } else {
            return navigate('/dashboardGuru')
            // }
        } catch (err) {
            if (err.response) {
                setMsg(err.response.data.msg)
            }
        }
    }

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={ Auth } className='box'>
                                <h1 className='columns is-centered title is-1'>Login</h1>
                                <p className='has-text-centered'>{ msg }</p>
                                <div className="field mt-5">
                                    <label className='label'>Username</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder='Username' value={ username } onChange={ (e) => setUname(e.target.value) } />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className='label'>Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder='********' value={ password } onChange={ (e) => setPassword(e.target.value) } />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className='button is-success is-fullwidth'>login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login