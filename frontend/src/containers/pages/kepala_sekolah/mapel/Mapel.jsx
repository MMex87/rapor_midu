import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const Mapel = (props) => {
    // deklarasi hooks dan axios
    const navigate = useNavigate()
    const axiosJWT = axios.create()

    // state 
    const [mapel, setMapel] = useState([])
    const [kelas, setKelas] = useState([])
    const [guru, setGuru] = useState([])

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

            if (decoded.role == "Admin") {
                return navigate('/mapel')
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


    // Hooks Use Effect
    useEffect(() => {
        refreshToken()
        getMapel()
        getGuru()
        getKelas()
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
                { kelas.map((isi, index) => (
                    <div className="container-fluid" key={ index }>
                        {/* /.row */ }
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header row">
                                        <h3 className="card-title col-4">Kelas { isi.kelas + isi.nama_kelas }</h3>
                                        <div className="col-6"></div>
                                        <div className="card-tools col-1">
                                            <div className="input-group input-group-sm" style={ { width: 150, marginTop: 1 } }>
                                                <input type="text" name="table_search" className="form-control float-right" placeholder="Search" />
                                                <div className="input-group-append">
                                                    <button type="submit" className="btn btn-default">
                                                        <i className="fas fa-search" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /.card-header */ }
                                    <div className="card-body table-responsive p-0">
                                        <table className="table table-hover table-dark text-nowrap">
                                            <thead>
                                                <tr>
                                                    <th>Mata Pelajaraan</th>
                                                    <th>Induk</th>
                                                    <th>Guru</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { mapel.map((val, index) => (
                                                    isi.id == val.id_kelas ?
                                                        <tr key={ index }>
                                                            <td className='col-5'>{ val.nama }</td>
                                                            <td className='col-2'>{ val.induk }</td>
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
                {/* /.content-header */ }
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