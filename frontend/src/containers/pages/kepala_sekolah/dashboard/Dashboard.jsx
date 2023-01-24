import React, { useEffect, useState } from 'react'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ActionType from '../../../../redux/reducer/globalActionType'

const Dashboard = (props) => {
    const navigate = useNavigate()

    const axiosJWT = axios.create()

    const [users, setUsers] = useState([])
    const [siswa, setSiswa] = useState([])
    const [siswaCount, setSiswaCount] = useState([])
    const [kelas, setKelas] = useState([])
    const [guru, setGuru] = useState([])

    const refreshToken = async () => {
        try {
            const response = await axios.get('/token')
            const decoded = jwt_decode(response.data.accessToken)
            const token = response.data.accessToken
            props.handleToken(token)
            props.handleName(decoded.name)
            props.handleExp(decoded.exp)
            props.handlePicture(decoded.picture)
            props.handleRole(decoded.role)
            props.handleTahunAjar(decoded.tahun)
            if (decoded.role == "Kepala Sekolah") {
                return navigate('/kepala/dashboard')
            }
        } catch (error) {
            return navigate('/')
        }
    }
    const getSiswaRecent = async () => {
        try {
            const response = await axiosJWT.get(`/siswaRecent?limit=${5}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setSiswa(response.data.result)
        } catch (error) {
            console.error(error);
        }
    }
    const getSiswa = async () => {
        try {
            const response = await axiosJWT.get(`/siswa`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setSiswaCount(response.data)
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
        } catch (error) {
            console.error(error);
        }
    }
    const getUser = async () => {
        const response = await axiosJWT.get('/users', {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        setUsers(response.data)
    }

    useEffect(() => {
        refreshToken()
        getUser()
        getSiswa()
        getGuru()
        getSiswaRecent()
        getKelas()
    }, [])

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date()
        if (props.expired * 1000 < currentDate.getTime()) {
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
    }, (error) => {
        return Promise.reject(error)
    })


    return (
        <div>
            {/* &lt; !--Content Wrapper.Contains page content-- &gt; */ }
            <div className="content-wrapper">
                {/* Content Header (Page header) */ }
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Dashboard</h1>
                            </div>{/* /.col */ }
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item active">Dashboard</li>
                                </ol>
                            </div>{/* /.col */ }
                        </div>{/* /.row */ }
                    </div>{/* /.container-fluid */ }
                </div>
                {/* /.content-header */ }
                {/* Main content */ }
                <section className="content">
                    <div className="container-fluid">
                        {/* Info boxes */ }
                        <div className="row">
                            <div className="col-12 col-sm-6 col-md-3">
                                <div className="info-box">
                                    <span className="info-box-icon bg-info elevation-1"><i className="fa-solid fa-graduation-cap" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">Siswa</span>
                                        <span className="info-box-number">
                                            { siswaCount.length }
                                        </span>
                                    </div>
                                    {/* /.info-box-content */ }
                                </div>
                                {/* /.info-box */ }
                            </div>
                            {/* /.col */ }
                            <div className="col-12 col-sm-6 col-md-3">
                                <div className="info-box mb-3">
                                    <span className="info-box-icon bg-danger elevation-1"><i className="fa-solid fa-school-flag" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">Kelas</span>
                                        <span className="info-box-number">{ kelas.length }</span>
                                    </div>
                                    {/* /.info-box-content */ }
                                </div>
                                {/* /.info-box */ }
                            </div>
                            {/* /.col */ }
                            {/* fix for small devices only */ }
                            <div className="clearfix hidden-md-up" />
                            <div className="col-12 col-sm-6 col-md-3">
                                <div className="info-box mb-3">
                                    <span className="info-box-icon bg-success elevation-1"><i className="fa-solid fa-person-chalkboard" /></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">Guru</span>
                                        <span className="info-box-number">{ guru.length }</span>
                                    </div>
                                    {/* /.info-box-content */ }
                                </div>
                                {/* /.info-box */ }
                            </div>
                            {/* /.col */ }
                            <div className="col-12 col-sm-6 col-md-3">
                                <div className="info-box mb-3">
                                    <span className="info-box-icon bg-warning elevation-1"><i className="fa-sharp fa-solid fa-person"></i></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">Admin</span>
                                        <span className="info-box-number">{ users.length }</span>
                                    </div>
                                    {/* /.info-box-content */ }
                                </div>
                                {/* /.info-box */ }
                            </div>
                            {/* /.col */ }
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title" style={ { color: '#fff' } }>Data Siswa Terbaru</h3>
                                <div className="card-tools">
                                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                                        <i className="fas fa-minus" />
                                    </button>
                                    <button type="button" className="btn btn-tool" data-card-widget="remove">
                                        <i className="fas fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-hover table-dark text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NIS</th>
                                            <th>NISN</th>
                                            <th>Nama Siswa</th>
                                            <th>Tanggal Lahir</th>
                                            <th>Kelas</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { siswa.map((val, index) => (
                                            <tr key={ index + 1 }>
                                                <td className='col-sm-1'>{ index + 1 }</td>
                                                <td className='col-sm-2'>{ val.nis }</td>
                                                <td className='col-sm-2'>{ val.nisn }</td>
                                                <td className='col-sm-3'>{ val.nama }</td>
                                                <td className='col-sm-1'>{ val.tanggal_lahir }</td>
                                                {
                                                    kelas.map((value) => (
                                                        val.id_kelas == value.id ?
                                                            <td className='col-sm-1'>
                                                                { value.kelas + value.nama_kelas }
                                                            </td> : ''

                                                    ))
                                                }
                                                <td className='col-sm-1'>
                                                    { val.status }
                                                </td>
                                            </tr>
                                        )) }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
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


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
// export default Dashboard