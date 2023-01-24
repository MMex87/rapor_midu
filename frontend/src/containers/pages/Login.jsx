import React, { useEffect, useState } from 'react'
import axios from "../../api/axios"
import jwt_decode from 'jwt-decode'
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [msg, setMsg] = useState('')
    const navigate = useNavigate()

    // refresh Token
    const AuthLogin = async () => {
        try {
            await axios.get('/token')

            navigate('/dashboard')
        } catch (error) {
            return navigate('/')
        }
    }


    useEffect(() => {
        AuthLogin()
    }, [])


    const Auth = async (e) => {
        e.preventDefault()
        try {
            await axios.post('/login', {
                email, password
            })
            const response = await axios.get('/token')
            const decoded = jwt_decode(response.data.accessToken)
            if (decoded.role == 'Kepala Sekolah') {
                navigate('/kepala/dashboard')
            } else {
                navigate('/dashboard')

            }
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
                                    <label className='label'>Email or username</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder='Username' value={ email } onChange={ (e) => setEmail(e.target.value) } />
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