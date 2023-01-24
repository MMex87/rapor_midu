import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import ReactPaginate from 'react-paginate'

export const Siswa = (props) => {
    // alert

    const Toast = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    // deklarasi hooks dan axios
    const navigate = useNavigate()
    const axiosJWT = axios.create()

    // deklarasi state
    const [siswa, setSiswa] = useState([])
    const [kelas, setKelas] = useState([])
    const [handle, setHandle] = useState(false)

    // state Pagination dan search
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
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
                return navigate('/kepala/siswa')
            }
        } catch (error) {
            return navigate('/')
        }
    }

    // get Datas
    const getSiswa = async () => {
        try {
            const response = await axiosJWT.get(`/siswaSearch?search=${search}&limit=${limit}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setSiswa(response.data.result)
            setPage(response.data.page)
            setPages(response.data.totalPage)
            setRows(response.data.totalRows)
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

    // handle Hapus

    const handleHapus = async (val) => {
        try {
            Toast.fire({
                title: 'Apa Kamu Yakin?',
                text: "Kamu akan Menghapus Data Siswa!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok, Hapus!',
                cancelButtonText: 'Tidak, Batal!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Toast.fire(
                        'Terhapus!',
                        'Data Siswa Sudah Terhapus.',
                        'success'
                    ).then((res) => {
                        if (res.isConfirmed)
                            setHandle(false)
                    })
                    axios.delete(`/siswa/${val}`)
                    setHandle(true)
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Toast.fire(
                        'Dibatalkan',
                        'Data Siswa tetap aman :)',
                        'error'
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
        getSiswa()
        getKelas()
    }, [handle == true, page, search])


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
                                <h1 className="m-0">Siswa</h1>
                            </div>{/* /.col */ }
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to={ "/dashboard" }>Dashboard</Link></li>
                                    <li className="breadcrumb-item active">Siswa</li>
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
                                    <h3 className="card-title col-4">Data Siswa</h3>
                                    <div className="col-5"></div>
                                    <div className="card-tools col-1">
                                        <div className="input-group input-group-sm" style={ { width: 150, marginTop: 1 } }>
                                            <input type="text" name="table_search" className="form-control float-right" placeholder="Search" onChange={ (e) => setSearch(e.target.value) } />
                                            <div className="input-group-append">
                                                <button type="submit" className="btn btn-default">
                                                    <i className="fas fa-search" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-2 d-flex justify-content-end">
                                        <Link type='button' className='btn btn-success btn-sm' to={ `tambah` }>
                                            Tambah <i className="fa-solid fa-plus"></i>
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-0">
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
                                                <th>Aksi</th>
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
                                                    <td className='d-flex justify-content-around'>
                                                        <div className='me-5'>
                                                            <Link type='button' className='btn btn-warning' to={ `edit/${val.id}` }>
                                                                Edit
                                                            </Link>
                                                        </div>
                                                        <div className='ms-5'>
                                                            <button type='button' className='btn btn-danger' onClick={ () => handleHapus(val.id) }>
                                                                Hapus
                                                            </button>
                                                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Siswa)