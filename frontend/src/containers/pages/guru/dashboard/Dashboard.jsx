import React, { useEffect, useState } from 'react'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ActionType from '../../../../redux/reducer/globalActionType'
import ReactPaginate from 'react-paginate'
import Swal from 'sweetalert2'

const Dashboard = (props) => {
    // Definisi Alert
    const Toast = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    const navigate = useNavigate()
    const axiosJWT = axios.create()

    // state Datas
    const [users, setUsers] = useState([])
    const [tahun, setTahun] = useState([])
    const [siswaCount, setSiswaCount] = useState([])
    const [kelasCount, setKelasCount] = useState([])
    const [guru, setGuru] = useState([])
    const [tahunAjar, setTahunAjar] = useState([])
    const [rapor, setRapor] = useState([])

    // state
    const [idGuru, setIdGuru] = useState('')
    const [handle, setHandle] = useState(false)

    // state Pagination dan search
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(5)
    const [pages, setPages] = useState(0)
    const [rows, setRows] = useState(0)

    // Refresh Token
    const refreshToken = async () => {
        try {
            const response = await axios.get('/tokenGuru')
            const decoded = jwt_decode(response.data.accessToken)
            const token = response.data.accessToken
            props.handleToken(token)
            props.handleName(decoded.nama)
            props.handleExp(decoded.exp)
            props.handlePicture(decoded.picture)
            props.handleRole(decoded.role)
            props.handleTahunAjar(decoded.tahun)
            setIdGuru(decoded.userId)
        } catch (error) {
            return navigate('/')
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
            const response = await axiosJWT.get(`/kelas/${props.tahun_ajar}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setKelasCount(response.data)
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
    const getData = async () => {
        try {
            const responseTahun = await axiosJWT.get(`/tahunAjarPage?limit=${limit}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setTahun(responseTahun.data.result)
            setPage(responseTahun.data.page)
            setPages(responseTahun.data.totalPage)
            setRows(responseTahun.data.totalRows)
            setLimit(responseTahun.data.limit)
        } catch (error) {
            console.error(error);
        }
    }
    const getTahunAjar = async () => {
        const response = await axiosJWT.get(`/tahunAjar`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        setTahunAjar(response.data)
    }
    const getRapor = async () => {
        try {
            const response = await axiosJWT.get('/rapor', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setRapor(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    // handel Pagenation
    const changePage = ({ selected }) => {
        setPage(selected)
    }

    // handle pilih Tahun ajar
    const handleTahunAjar = async (tahun_ajar) => {
        try {
            Toast.fire({
                title: 'Apa Kamu Yakin?',
                text: `Kamu akan Menganti Tahun Ajar!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok, Ganti!',
                cancelButtonText: 'Tidak, Batal!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Toast.fire(
                        'Success!',
                        `Data berhasil Berganti.`,
                        'success'
                    )
                    axios.put(`/guru/${idGuru}`, {
                        tahunAjar: tahun_ajar
                    })
                    setHandle(!handle)
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Toast.fire(
                        'Dibatalkan',
                        `Data Belum Berganti :)`,
                        'error'
                    )
                }
            })
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        refreshToken()
        getUser()
        getSiswa()
        getGuru()
        getKelas()
        getData()
        getTahunAjar()
        getRapor()
    }, [props.token, page, handle])

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date()
        if (props.expired * 1000 < currentDate.getTime()) {
            const response = await axios.get('/tokenGuru')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            props.handleToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            props.handleExp(decoded.exp)
            props.handleName(decoded.nama)
            props.handlePicture(decoded.picture)
            props.handleRole(decoded.role)
            props.handleTahunAjar(decoded.tahun)
            setIdGuru(decoded.userId)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })


    return (
        <div>
            <div className="content-wrapper">
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
                                    <span className="info-box-number">{ kelasCount.length }</span>
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
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header row">
                                        <h3 className="card-title col-4">Data Rapor Dahulu</h3>
                                        <div className="col-6"></div>
                                        <div className="col-2 d-flex justify-content-end">
                                            <div className="card-tools">
                                                <button type="button" className="btn btn-tool " data-card-widget="collapse">
                                                    <i className="fas fa-minus" />
                                                </button>
                                            </div>
                                            <div className="card-tools me-5">
                                                <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body table-responsive p-0">
                                        <table className="table table-hover table-dark text-nowrap table-bordered" >
                                            <thead>
                                                <tr className='container'>
                                                    <th>No</th>
                                                    <th>Tahun Ajar</th>
                                                    <th>Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    tahun.map((val, index) => (
                                                        <tr>
                                                            <td>{ index + 1 }</td>
                                                            <td>{ val.tahun_ajar }</td>
                                                            <td>
                                                                {
                                                                    val.tahun_ajar == props.tahun_ajar
                                                                        ?
                                                                        'Terpilih'
                                                                        :
                                                                        <button className='btn btn-success' onClick={ () => handleTahunAjar(val.tahun_ajar) }>Pilih
                                                                        </button>
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-3">
                                        <div className='d-flex justify-content-between'>
                                            <p className='text-center'>Total Siswa : { rows } Page: { rows ? page + 1 : 0 } of { pages }</p>
                                            <nav aria-label="Page navigation example justify-content-end">
                                                <ReactPaginate
                                                    previousLabel={ "< Prev" }
                                                    nextLabel={ "Next >" }
                                                    pageCount={ pages }
                                                    onPageChange={ changePage }
                                                    containerClassName={ 'pagination' }
                                                    pageLinkClassName={ 'page-link' }
                                                    pageClassName={ 'page-item' }
                                                    previousLinkClassName={ 'page-link' }
                                                    previousClassName={ 'page-item' }
                                                    nextClassName={ 'page-item' }
                                                    nextLinkClassName={ 'page-link' }
                                                    activeClassName={ 'active' }
                                                />
                                            </nav>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
// export default Dashboard