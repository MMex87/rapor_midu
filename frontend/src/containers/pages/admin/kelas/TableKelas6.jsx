import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'

export const TableKelas6 = (props) => {
    const Nkelas = '6'
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

    // state
    const [nama_kelas, setNama] = useState('')
    const [wali, setWali] = useState('')
    const [display, setDisplay] = useState(false)
    const [visi, setVisi] = useState('d-none')
    const [idKelas, setIdKelas] = useState('')
    const [id_guru, setIdGuru] = useState('')
    const [id_guru2, setIdGuru2] = useState('')
    const [handle, setHandle] = useState(false)

    // state Data
    const [kelas, setKelas] = useState([])
    const [guru, setGuru] = useState([])
    const [siswa, setSiswa] = useState([])



    // handel Auto complate

    const handleAuto = (val, val2) => {
        setDisplay(false)
        setWali(val)
        setIdGuru(val2)
    }

    // handel edit
    const handleEdit = (id, nama, idGuru) => {
        setVisi('')
        setIdKelas(id)
        setNama(nama)
        setIdGuru(idGuru)
        setIdGuru2(idGuru)
        getGuruId(idGuru)
    }
    // handel Back
    const handleBack = () => {
        setVisi('d-none')
        setIdKelas('')
        setWali('')
        setNama('')
        setIdGuru('')
        setIdGuru2('')
        getGuruId('')
    }

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
                return navigate('/kepala/kelas')
            }
        } catch (error) {
            return navigate('/')
        }
    }


    // get Datas
    const getKelas = async () => {
        try {
            const response = await axiosJWT.get('/kelas', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setKelas(response.data)
        } catch (error) {
            console.error(error)
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
    const getSiswa = async () => {
        try {
            const response = await axiosJWT.get('/siswa', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setSiswa(response.data)
        } catch (error) {
            console.error(error);
        }
    }
    const getGuruId = async (idGuru) => {
        try {
            const response = await axiosJWT.get(`/guru/${idGuru}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setWali(response.data.nama)
        } catch (error) {
            console.error(error)
        }
    }

    // handel tambah kelas
    const Tambah = async (e) => {
        e.preventDefault()
        if (idKelas == '') {
            try {
                await axios.post('/kelas', {
                    kelas: Nkelas, nama_kelas, id_guru
                })
                await axios.put(`/guruRole/${id_guru}`, {
                    role: 'Wali Kelas'
                })
                Toast.fire({
                    icon: 'success',
                    title: 'Berhasil di Tambahkan',

                })
                getKelas()
                getGuru()
                setVisi('d-none')
                setIdKelas('')
                setWali('')
                setNama('')
                setIdGuru('')
                setIdGuru2('')
                getGuruId('')

            } catch (error) {
                console.log(error);
            }

        } else {

            await axios.put(`/kelas/${idKelas}`, {
                nama_kelas, id_guru
            })
            if (id_guru != id_guru2) {
                await axios.put(`/guruRole/${id_guru}`, {
                    role: 'Wali Kelas'
                })
                await axios.put(`/guruRole/${id_guru2}`, {
                    role: 'Guru'
                })
            }

            Toast.fire({
                icon: 'success',
                title: 'Berhasil di DiEdit',

            })

            getKelas()
            getGuru()
            setVisi('d-none')
            setIdKelas('')
            setWali('')
            setNama('')
            setIdGuru('')
            setIdGuru2('')
            getGuruId('')
        }
    }

    // handale hapus
    const handleHapus = async (id_kelas) => {
        try {
            const response = await axiosJWT.get(`/kelas/${id_kelas}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })

            Toast2.fire({
                title: 'Apa Kamu Yakin?',
                text: "Kamu akan Menghapus Data Kelas!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok, Hapus!',
                cancelButtonText: 'Tidak, Batal!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Toast2.fire(
                        'Terhapus!',
                        'Data Kelas Sudah Terhapus.',
                        'success'
                    ).then((res) => {
                        if (res.isConfirmed)
                            setHandle(false)
                    })
                    axios.put(`/guruRole/${response.data.id_guru}`, {
                        role: 'Guru'
                    })
                    axios.delete(`/kelas/${id_kelas}`)
                    // navigate('/siswa')
                    setHandle(true)
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Toast2.fire(
                        'Dibatalkan',
                        'Data Guru tetap aman :)',
                        'error'
                    )
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    // Hooks Use Effect
    useEffect(() => {
        refreshToken()
        getGuru()
        getKelas()
        getSiswa()
        return () => {
            refreshToken()
        }
    }, [handle == true])

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
        <>
            <div className="container-fluid">
                {/* /.row */ }
                <div className="row">
                    <div className="col-12">
                        <div className="card collapsed-card">
                            <div className="card-header row">
                                <h3 className="card-title col-4">Data Kelas { Nkelas }</h3>
                                <div className="col-5"></div>
                                <div className="col-2 d-flex justify-content-end">
                                    <a type='button' onClick={ () => setVisi('') } className='btn btn-success btn-sm' href={ '#edit' + Nkelas } >
                                        Tambah <i className="fa-solid fa-plus"></i>
                                    </a>
                                </div>
                                <div className="col-1 d-flex justify-content-end card-tools">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-plus"></i>
                                    </button>
                                    <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div className="card-body row">
                                { kelas.filter(({ kelas, tahun_ajar }) => kelas == Nkelas && tahun_ajar == props.tahun_ajar).map((val, index) => (
                                    <div className="col-md-12" key={ index }>
                                        <div className="card card-success shadow-sm">
                                            <div className="card-header">
                                                <h3 className="card-title container">Kelas { val.kelas + val.nama_kelas }</h3>
                                                <div className="card-tools d-flex justify-content-end">
                                                    <button type="button" className="btn btn-tool " data-card-widget="collapse">
                                                        <i className="fas fa-minus" />
                                                    </button>
                                                </div>
                                                <div className="card-tools d-flex justify-content-end">
                                                    <button type="button" className="btn btn-tool" data-card-widget="maximize"><i className="fas fa-expand" />
                                                    </button>
                                                </div>
                                                <div className="card-tools d-flex justify-content-end me-5">
                                                    <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row mb-3">
                                                    <div className="col-md-3">
                                                        Wali Kelas
                                                    </div>
                                                    <div className="col-md-1">:</div>
                                                    <div className="col-md-6">
                                                        {
                                                            guru.map((value) => (
                                                                <>
                                                                    {
                                                                        value.id === val.id_guru ? value.nama : ''
                                                                    }

                                                                </>
                                                            ))
                                                        }
                                                    </div>
                                                    <div className="col-md-1 d-flex justify-content-end">
                                                        <a className='btn btn-warning btn-sm me-5' href='#edit' onClick={ () => handleEdit(val.id, val.nama_kelas, val.id_guru) }>
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                        </a>
                                                    </div>
                                                    <div className="col-md-1 d-flex justify-content-end">
                                                        <button className='btn btn-danger btn-sm ms-3' onClick={ () => handleHapus(val.id) } >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="card-body table-responsive p-0" style={ { height: 200 } }>
                                                    <table className="table table-hover table-head-fixed table-dark text-nowrap">
                                                        <thead>
                                                            <tr>
                                                                <th style={ { backgroundColor: '#fff' } } >No</th>
                                                                <th style={ { backgroundColor: '#fff' } }>Siswa</th>
                                                                <th style={ { backgroundColor: '#fff' } }>NIS</th>
                                                                <th style={ { backgroundColor: '#fff' } }>NISN</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            { siswa.filter(({ id_kelas }) => id_kelas == val.id).map((value, indek) => (
                                                                <tr key={ indek + 1 }>
                                                                    <td>{ indek + 1 }</td>
                                                                    <td>{ value.nama }</td>
                                                                    <td>{ value.nis }</td>
                                                                    <td>{ value.nisn }</td>
                                                                </tr>
                                                            )) }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )) }
                            </div>
                        </div>
                        <div className={ visi }>
                            <div className={ 'card' } id={ 'edit' + Nkelas }>
                                <div className="card-header row">
                                    <h3 className="card-title col-10">Tambah Kelas { Nkelas }</h3>
                                    <div className="col-2 d-flex justify-content-end">
                                        <a type='button' onClick={ () => handleBack() } className='btn btn-warning btn-sm' href='#edit' >
                                            Back
                                        </a>
                                    </div>
                                </div>
                                <div className="row p-5">
                                    <div className="col-md-10" >
                                        <div className="form-group">
                                            <form onSubmit={ Tambah }>
                                                <div>
                                                    <label>Nama Kelas</label>
                                                    <input type="text" placeholder='A' className="form-control select2" style={ { width: '100%' } } onChange={ (e) => setNama(e.target.value) } value={ nama_kelas } maxLength='1' />
                                                </div>
                                                <div className='mt-3'>
                                                    <label>Wali Kelas</label>
                                                    <input type="text" className="form-control select2" onClick={ () => setDisplay(!display) } style={ { width: '100%' } } onChange={ (e) => setWali(e.target.value) } value={ wali } />
                                                    {
                                                        display && (
                                                            <div className="flex-container flex-column pos-rel">
                                                                <ul className="list-group list-group-flush">
                                                                    {
                                                                        guru
                                                                            .filter(({ nama, role }) =>
                                                                                nama.indexOf(wali) > -1 &&
                                                                                role == "Guru"
                                                                            )
                                                                            .map((v, i) => (
                                                                                <li key={ i } onClick={ () => { handleAuto(v.nama, v.id) } } class="list-group-item">{ v.nama }</li>
                                                                            ))
                                                                    }
                                                                </ul>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className='mt-5 d-flex justify-content-end'>
                                                    <button className='btn btn-success'>
                                                        Save
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableKelas6)