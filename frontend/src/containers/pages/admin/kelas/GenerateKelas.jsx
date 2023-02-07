import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import Swal from 'sweetalert2'

const GenerateKelas = (props) => {
    // alert
    const Toast = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    // axios
    const axiosJWT = axios.create()
    const navigate = useNavigate()

    // state data
    const [kelas, setKelas] = useState([])
    const [guru, setGuru] = useState([])
    const [dataCheck, setDataCheck] = useState([])

    // state handle
    const [visi, setVisi] = useState(false)
    const [visi2, setVisi2] = useState(false)
    const [handle, setHandle] = useState(true)

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
                return navigate('/kepala/mapel')
            }
        } catch (error) {
            return navigate('/')
            // console.error(error);
        }
    }

    // getDatas

    // get Datas
    const getData = async () => {
        const tahunAjar = props.tahun_ajar
        const tahun = props.tahun_ajar.split('/')
        const tahun1 = tahun[0]
        const tahun2 = tahun1 - 1
        const tahunAjarLama = tahun2 + '/' + tahun1

        const responseTahun = await axios.get(`/tahunAjar`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        const responseKelas = await axios.get(`/kelas/${tahunAjar}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        const data = responseTahun.data

        if (data.find(({ tahun_ajar }) => tahun_ajar == tahunAjarLama) != null) {
            if (responseKelas.data == 0) {
                setVisi2(true)
            }
        }
    }

    const getKelas = async () => {
        const tahun = props.tahun_ajar.split('/')
        const tahun1 = tahun[0]
        const tahun2 = tahun1 - 1
        const tahunAjarLama = tahun2 + '/' + tahun1
        try {
            const response = await axiosJWT.get(`/kelas/${tahunAjarLama}`, {
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

    const handleChecked = (e) => {
        const { name, checked } = e.target

        if (name == 'AllSelect') {
            const tempCheck = dataCheck.map(data => { return { ...data, isChecked: checked } })
            setDataCheck(tempCheck)
        } else {
            const tempCheck = dataCheck.map(data => data.id == name ? { ...data, isChecked: checked } : data)
            setDataCheck(tempCheck)
        }
    }


    const handleBack = () => {
        setVisi(!visi)
        setHandle(!handle)
    }

    // Hooks Use Effect
    useEffect(() => {
        refreshToken()
        getKelas()
        getGuru()
        setDataCheck(kelas)
        getData()
    }, [visi, visi2])



    // handle Tambah Data
    const Tambah = async (e) => {
        e.preventDefault()
        Toast.fire({
            title: 'Apa Kamu Yakin?',
            text: `Kamu akan Mengenerate Data Raport!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ok, Generate!',
            cancelButtonText: 'Tidak, Batal!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    for (let val of dataCheck.filter(data => data?.isChecked == true)) {
                        axios.post('/kelas', {
                            kelas: val.kelas, nama_kelas: val.nama_kelas, id_guru: val.id_guru, tahun_ajar: props.tahun_ajar
                        })
                    }
                } catch (err) {
                    console.error(err)
                }
                Toast.fire(
                    'Tergenerate!',
                    `Data berhasil Tergenerate.`,
                    'success'
                ).then((res) => {
                    if (res.isConfirmed) {
                        navigate('tempKelas')
                    }
                })
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                Toast.fire(
                    'Dibatalkan',
                    `Data Belum Tergenerate :)`,
                    'error'
                )
            }
        })

    }

    // axios interceptors
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
            {
                visi2
                &&
                <div className="container-fluid">
                    {/* /.row */ }
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header row">
                                    <h3 className="card-title col-4">Tambah Mapel</h3>
                                    <div className="col-7"></div>
                                    <div className="col-1 d-flex justify-content-end">
                                        {
                                            handle
                                                ?
                                                <button type="button" class="btn btn-primary btn-sm" onClick={ () => handleBack() }>Generate
                                                </button>
                                                :
                                                <button type="button" class="btn btn-warning btn-sm" onClick={ () => handleBack() }>Back
                                                </button>
                                        }
                                    </div>

                                </div>
                                {
                                    visi &&
                                    (<div className={ "card-body" } style={ { height: 300 } }>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <form onSubmit={ Tambah }>
                                                    <table className="table table-hover table-head-fixed table-dark text-nowrap">
                                                        <thead>
                                                            <tr>
                                                                <th style={ { backgroundColor: '#fff' } }>No</th>
                                                                <th style={ { backgroundColor: '#fff' } }>Nama Kelas</th>
                                                                <th style={ { backgroundColor: '#fff' } }>Wali Kelas</th>
                                                                <th style={ { backgroundColor: '#fff' } }>Aksi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            { dataCheck.map((value, indek) => (
                                                                <tr key={ indek + 1 }>
                                                                    <td>{ indek + 1 }</td>
                                                                    <td>{ value.kelas + '' + value.nama_kelas }</td>
                                                                    <td>
                                                                        {
                                                                            guru.find(({ id }) => id == value.id_guru).nama
                                                                        }
                                                                    </td>
                                                                    <td><label className="checkbox">
                                                                        <input
                                                                            type="checkbox"
                                                                            name={ value.id }
                                                                            onChange={ handleChecked }
                                                                            checked={ value?.isChecked || false }
                                                                        />
                                                                    </label>
                                                                    </td>
                                                                </tr>
                                                            )) }
                                                            <tr>
                                                                <td colSpan={ 3 } >
                                                                    <label className='d-flex justify-content-end'>
                                                                        Select All
                                                                    </label>
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        name='AllSelect'
                                                                        checked={ dataCheck.filter(data => data?.isChecked != true).length < 1 }
                                                                        onChange={ handleChecked } />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <div className='d-flex justify-content-end'>
                                                        <button className='btn btn-success'>Generate</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>)
                                }
                            </div>
                            {/* /.card */ }
                        </div>
                    </div>
                </div>
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(GenerateKelas)