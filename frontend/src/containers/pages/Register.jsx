import React, { useState } from 'react'
import axios from "../../api/axios"
import { useNavigate } from "react-router-dom"

const Register = () => {

    const fileInput = React.createRef()

    // state
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [msg, setMsg] = useState('')

    // state Foto profile
    const [picture, setPicture] = useState('default.png')
    const [foto, setFoto] = useState('http://localhost:3000/assets/uploads/default.png')
    const [saveImage, setSaveImage] = useState(null)
    const [statusUp, setStatusUp] = useState(0)


    // navigate
    const navigate = useNavigate()


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
            window.alert('Tolong Pilih gambar Terlebih dalulu!!')
        } else if (statusUp == 2) {
            window.alert('Foto Sudah Tersimpan!!')
        } else {
            await axios({
                method: "POST",
                url: '/img/uploads',
                data: formData,
            }).then((res) => {
                setFoto(res.data.image)
                setPicture(res.data.name)
                setStatusUp(2)
                window.alert('Foto Berhasil di Upload!!')
            }).catch((err) => {
                console.error(err)
            })
        }

    }


    const Register = async (e) => {
        e.preventDefault()
        const role = 'Admin'
        try {
            await axios.post('/users', {
                name, email, password, confPassword, role, picture
            })
            navigate('/')
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
                            <form onSubmit={ Register } className='box'>
                                <h1 className='columns is-centered title is-1'>Register</h1>
                                <p className='has-text-centered'>{ msg }</p>
                                <div className="field mt-5">
                                    <label className='label'>Name</label>
                                    <div className="controls">
                                        <input type="text" className="input" id='name' placeholder='name' value={ name } onChange={ (e) => setName(e.target.value) } />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className='label'>Email</label>
                                    <div className="controls">
                                        <input type="text" className="input" id='email' placeholder='Email' value={ email } onChange={ (e) => setEmail(e.target.value) } />
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <label>Foto Profile</label>
                                    <div className="w-25 mt-3 mb-3" style={ { marginLeft: 50 } }>
                                        <img src={ foto } className='img-thumbnail'></img>
                                    </div>
                                    <div className="input-group">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="exampleInputFile" accept='image/*' onChange={ handleFoto } ref={ fileInput } />
                                            <label className="custom-file-label" htmlFor="exampleInputFile">{ foto == 'http://localhost:3000/assets/uploads/default.png' ? 'Pilih Gambar' : picture }</label>
                                        </div>
                                        <div className="input-group-append">
                                            <button type='button' className="input-group-text" onClick={ handleUploadFoto }>Upload</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className='label'>Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder='********' value={ password } onChange={ (e) => setPassword(e.target.value) } />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className='label'>confirm Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder='********' value={ confPassword } onChange={ (e) => setConfPassword(e.target.value) } />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className='button is-success is-fullwidth'>Register</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register