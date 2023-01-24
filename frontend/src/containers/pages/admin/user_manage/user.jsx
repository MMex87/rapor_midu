import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'

export const user = (props) => {
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

    // deklarasi hooks dan axios
    const navigate = useNavigate()
    const axiosJWT = axios.create()

    const [handle, setHandle] = useState(false)
    const foto = "http://localhost:8076/assets/uploads/"

    // state get datas
    const [users, setUsers] = useState([])
    const [guru, setGuru] = useState([])


    // Deklarasi password Default
    const pwKepala = 'kepsekmidu'
    const pwadmin = 'adminmidu'
    const pwGuru = 'gurumidu'


    // state Pagination dan search
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(5)
    const [pages, setPages] = useState(0)
    const [rows, setRows] = useState(0)

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
                return navigate('/kepala/dashboard')
            } else if (decoded.role == "Admin") {
                return navigate('/dashboard')
            }
        } catch (error) {
            return navigate('/')
        }
    }

    // getDatas
    const getUser = async () => {
        const response = await axiosJWT.get('/users', {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        setUsers(response.data)
    }

    const getGuru = async () => {
        try {
            const response = await axiosJWT.get(`/guruSearch?search=${search}&limit=${limit}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setGuru(response.data.result)
            setPage(response.data.page)
            setPages(response.data.totalPage)
            setRows(response.data.totalRows)
        } catch (error) {
            console.error(error);
        }
    }

    // Handle Tombol
    // handle Hapus Kepala Sekolah

    const hapusKepala = async (val, role) => {
        try {
            Toast2.fire({
                title: 'Apa Kamu Yakin?',
                text: `Kamu akan Menghapus Data ${role}!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok, Hapus!',
                cancelButtonText: 'Tidak, Batal!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Toast2.fire(
                        'Terhapus!',
                        `Data ${role} Sudah Terhapus.`,
                        'success'
                    ).then((res) => {
                        if (res.isConfirmed)
                            setHandle(false)
                    })
                    axios.delete(`/users/${val}`)
                    setHandle(true)
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Toast2.fire(
                        'Dibatalkan',
                        `Data ${role} tetap aman :)`,
                        'error'
                    )
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    //handle reset password Kepala Sekolah
    const resetKepala = async (val, role) => {
        try {

            Toast2.fire({
                title: 'Apa Kamu Yakin?',
                text: `Kamu akan Mereset Password ${role}!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok, Reset!',
                cancelButtonText: 'Tidak, Batal!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Toast.fire(
                        'Reset!',
                        `Password ${role} Sudah di Reset.`,
                        'success',
                        'black'
                    )
                    if (role == 'Admin') {
                        const password = pwadmin
                        const confPassword = pwadmin
                        axios.put(`/users/${val}`, {
                            password, confPassword
                        })
                    } else {
                        const password = pwKepala
                        const confPassword = pwKepala
                        axios.put(`/users/${val}`, {
                            password, confPassword
                        })
                    }
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Toast.fire({
                        titleText: 'Dibatalkan',
                        text: `Password ${role} tetap aman :)`,
                        icon: 'error'
                    }
                    )
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    // handle add akun guru
    const handleAkunGuru = async (val) => {
        try {
            const password = pwGuru
            const confPassword = pwGuru

            const gurufind = await axiosJWT.get(`/guru/${val}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            const nama = gurufind.data.nama.split(" ")
            const username = nama[0] + nama[1]

            Toast2.fire({
                title: 'Apa Kamu Yakin?',
                text: `Kamu akan Menambahkan User Guru!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok, Tambahkan!',
                cancelButtonText: 'Tidak, Batal!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Toast2.fire(
                        'Terupdate!',
                        `User Guru Berhasil Ditambahkan.`,
                        'success'
                    ).then((res) => {
                        if (res.isConfirmed)
                            setHandle(false)
                    })
                    axios.put(`/guruUpdate/${val}`, {
                        username, password, confPassword
                    })
                    setHandle(true)
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Toast2.fire(
                        'Dibatalkan',
                        `User Guru Gagal di Tambahkan :)`,
                        'error'
                    )
                }
            })
            getGuru()
        } catch (error) {
            console.log(error);
        }
    }


    //handle reset password guru
    const resetGuru = async (val) => {
        try {
            Toast2.fire({
                title: 'Apa Kamu Yakin?',
                text: `Kamu akan Mereset Password Guru!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok, Reset!',
                cancelButtonText: 'Tidak, Batal!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Toast.fire(
                        'Reset!',
                        `Password Guru Sudah di Reset.`,
                        'success',
                        'black'
                    )
                    const password = pwGuru
                    const confPassword = pwGuru

                    axios.put(`/guruUpdate/${val}`, {
                        password, confPassword
                    })
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Toast.fire({
                        titleText: 'Dibatalkan',
                        text: `Pasword Guru tetap aman :)`,
                        icon: 'error'
                    }
                    )
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    // handel Pagenation
    const changePage = ({ selected }) => {
        setPage(selected)
    }

    // Hooks Use Effect
    useEffect(() => {
        refreshToken()
        getUser()
        getGuru()
    }, [handle == true || page || search])

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
                                <h1 className="m-0">User Manage</h1>
                            </div>{/* /.col */ }
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to={ "/dashboard" }>Dashboard</Link></li>
                                    <li className="breadcrumb-item active">User</li>
                                </ol>
                            </div>{/* /.col */ }
                        </div>{/* /.row */ }
                    </div>{/* /.container-fluid */ }
                </div>

                {/* User Kepala Sekolah */ }
                <div className="container-fluid">
                    {/* /.row */ }
                    <div className="row">
                        <div className="col-12">
                            <div className="card collapsed-card">
                                <div className="card-header row">
                                    <h3 className="card-title col-4">User Kepala Sekolah</h3>
                                    <div className="col-5">
                                        <p>Password Default : { pwKepala }</p>
                                    </div>
                                    <div className="col-2 d-flex justify-content-end">
                                        { (users.filter(({ role }) => role == "Kepala Sekolah").length > 0) ? (
                                            ''
                                        ) :
                                            <Link type='button' className='btn btn-success btn-sm' to={ `tambah` }>
                                                Tambah <i className="fa-solid fa-plus"></i>
                                            </Link> }
                                    </div>
                                    <div className="col-1 d-flex justify-content-end">
                                        <button type="button" className="btn btn-tool " data-card-widget="collapse">
                                            <i className="fas fa-minus" />
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover table-dark text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>Nama</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Picture</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { users.filter(({ role }) => role == "Kepala Sekolah").map((val, index) => (
                                                <tr key={ index + 1 }>
                                                    <td className='col-sm-3'>{ val.name }</td>
                                                    <td className='col-sm-3'>{ val.email }</td>
                                                    <td className='col-sm-1'>{ val.role }</td>
                                                    <td className='col-sm-3'>
                                                        {
                                                            <div className="w-75 mt-3 mb-3" style={ { marginLeft: 10 } }>
                                                                <img src={ foto + val.picture } className='img-thumbnail'></img>
                                                            </div>
                                                        }
                                                    </td>
                                                    <td className='col-sm-2 container p-2'>
                                                        <div className="row mt-2">
                                                            <button className='btn btn-warning' onClick={ () => resetKepala(val.id, 'Kepala Sekolah') }>Reset Password</button>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <button className='btn btn-danger' onClick={ () => hapusKepala(val.id, 'Kepala Sekolah') }>Hapus</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Admin */ }
                <div className="container-fluid">
                    {/* /.row */ }
                    <div className="row">
                        <div className="col-12">
                            <div className="card collapsed-card">
                                <div className="card-header row">
                                    <h3 className="card-title col-4">User Admin</h3>
                                    <div className="col-5">
                                        <p>Password Default : { pwadmin }</p>
                                    </div>
                                    <div className="col-2 d-flex justify-content-end">
                                        <Link type='button' className='btn btn-success btn-sm' to={ `tambahAdmin` }>
                                            Tambah <i className="fa-solid fa-plus"></i>
                                        </Link>
                                    </div>
                                    <div className="col-1 d-flex justify-content-end">
                                        <button type="button" className="btn btn-tool " data-card-widget="collapse">
                                            <i className="fas fa-minus" />
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover table-dark text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>Nama</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Picture</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { users.filter(({ role }) => role == "Admin").map((val, index) => (
                                                <tr key={ index + 1 }>
                                                    <td className='col-3'>{ val.name }</td>
                                                    <td className='col-3'>{ val.email }</td>
                                                    <td className='col-1'>{ val.role }</td>
                                                    <td className='col-3'>
                                                        {
                                                            <div className="w-75 mt-3 mb-3" style={ { marginLeft: 10 } }>
                                                                <img src={ foto + val.picture } className='img-thumbnail'></img>
                                                            </div>
                                                        }
                                                    </td>
                                                    <td className='col-2 container p-2'>
                                                        <div className="row mt-2">
                                                            <button className='btn btn-warning' onClick={ () => resetKepala(val.id, 'Admin') }>Reset Password</button>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <button className='btn btn-danger' onClick={ () => hapusKepala(val.id, 'Admin') }>Hapus</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )) }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* user Guru */ }
                <div className="container-fluid">
                    {/* /.row */ }
                    <div className="row">
                        <div className="col-12">
                            <div className="card collapsed-card">
                                <div className="card-header row">
                                    <h3 className="card-title col-4">User Guru</h3>
                                    <div className="col-5"> <p>Password Default : { pwGuru }</p></div>
                                    <div className="card-tools col-2">
                                        <div className="input-group input-group-sm" style={ { width: 150, marginTop: 1 } }>
                                            <input type="text" name="table_search" className="form-control float-right" placeholder="Search" onChange={ (e) => setSearch(e.target.value) } />
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-default">
                                                    <i className="fas fa-search" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-1 d-flex justify-content-end">
                                        <button type="button" className="btn btn-tool " data-card-widget="collapse">
                                            <i className="fas fa-minus" />
                                        </button>
                                        <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover table-dark text-nowrap">
                                        <thead>
                                            <tr>
                                                <th>Nama</th>
                                                <th>nuptk</th>
                                                <th>Role</th>
                                                <th>Picture</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { guru.map((val, index) => (
                                                <tr key={ index + 1 }>
                                                    <td className='col-sm-3'>{ val.nama }</td>
                                                    <td className='col-sm-3'>{ val.nuptk }</td>
                                                    <td className='col-sm-1'>{ val.role }</td>
                                                    <td className='col-sm-3'>
                                                        {
                                                            <div className="w-75 mt-3 mb-3" style={ { marginLeft: 10 } }>
                                                                <img src={ foto + val.picture } className='img-thumbnail'></img>
                                                            </div>
                                                        }
                                                    </td>
                                                    <td className='col-sm-2'>
                                                        { (val.password == null)
                                                            ?
                                                            <div div className="row mt-2">
                                                                <button className='btn btn-success' onClick={ () => handleAkunGuru(val.id) }>Add Account</button>
                                                            </div>
                                                            :
                                                            <div className="row mt-3">
                                                                <button className='btn btn-warning' onClick={ () => resetGuru(val.id) }>Reset Password</button>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                            )) }
                                        </tbody>
                                    </table>
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
        </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(user)