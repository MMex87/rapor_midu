import React, { useEffect, useState } from 'react'
import axios from '../../../../api/axios'
import { useNavigate, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ActionType from '../../../../redux/reducer/globalActionType'
import jwt_decode from 'jwt-decode'
import Swal from 'sweetalert2'

export const ProgresRapor = (props) => {
    // alert
    const Toast = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })


    const navigate = useNavigate()

    const axiosJWT = axios.create()

    // state data
    const [kelas, setKelas] = useState([])
    const [mapel, setMapel] = useState([])
    const [guru, setGuru] = useState([])
    const [dataProgres, setDataProgres] = useState([])
    const [handle, setHandle] = useState(false)

    let ajaranBaru = false;

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
    const getMapel = async () => {
        try {
            const response = await axiosJWT.get('/mapel', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setMapel(response.data)
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

    const progres = async () => {
        try {
            const response = await axiosJWT.get('/kelasProgres/progres', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            setDataProgres(response.data)
            const data = response.data
            let point = 0
            for (let i = 0; i < data.length; i++) {
                if (data[i] == 100) {
                    point = point + 1
                }
            }
            if (point == data.length) {
                ajaranBaru = true
            }
            console.log(point);
        } catch (error) {
            console.error(error)
        }
    }

    const gantiAjaranBaru = () => {
        try {
            let ajaran = props.tahun_ajar.split('/')
            let tahunLama = ajaran[1]
            let tahunBaru = parseInt(ajaran[1])
            tahunBaru = tahunBaru + 1
            const tahunAjaranBaru = tahunLama + '/' + tahunBaru

            Toast.fire({
                title: 'Apa Kamu Yakin?',
                text: "Kamu akan Menganti Ajaran Baru!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ok, Hapus!',
                cancelButtonText: 'Tidak, Batal!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {

                    Toast.fire(
                        'Terhapus!',
                        'Ajaran Baru Sudah Dimulai!',
                        'success'
                    ).then((res) => {
                        if (res.isConfirmed)
                            setHandle(false)
                    })

                    axios.post('/tahunAjar', {
                        tahun_ajar: tahunAjaranBaru
                    })
                    setHandle(true)
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    Toast.fire(
                        'Dibatalkan',
                        'Ajaran Baru Gagal dilaksanakan! :)',
                        'error'
                    )
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const generateKelas = async () => {
        let ajaran = props.tahun_ajar.split('/')
        let tahunLama = parseInt(ajaran[0])
        let tahunBaru = ajaran[0]
        tahunBaru = tahunBaru - 1
        const tahunAjaranLama = tahunBaru + '/' + tahunLama
        const kelasLama = kelas.filter(({ tahun_ajar }) => tahun_ajar == tahunAjaranLama)


        Toast.fire({
            title: 'Apa Kamu Yakin?',
            text: `Kamu akan Mengenerate semua Data Mapel!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ok, Generate!',
            cancelButtonText: 'Tidak, Batal!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                Toast.fire(
                    'Tergenerate!',
                    `Data berhasil Tergenerate.`,
                    'success'
                ).then((res) => {
                    if (res.isConfirmed)
                        setHandle(false)
                })
                for (let k of kelasLama) {
                    axios.post('/kelas', {

                    })
                }
                setHandle(true)
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


    const generateMapel = () => {

    }

    useEffect(() => {
        refreshToken()
        getKelas()
        getMapel()
        getGuru()
        progres()
    }, [handle == true])

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
        <div className="card">
            <div className="card-header row">
                <h4 className="card-title col-4" style={ { color: '#fff' } }>Progres Rapor Untuk Semua Kelas</h4>
                <div className='col-4 d-flex justify-content-end'>
                    {
                        (kelas.filter(({ tahun_ajar }) => tahun_ajar == props.tahun_ajar).length == 0)
                        &&
                        <button className='btn btn-success' onClick={ () => generateKelas() }>Generate Kelas Lama</button>
                    }
                </div>
                <div className='col-3 d-flex justify-content-end'>
                    {
                        (mapel.filter(({ tahun_ajar }) => tahun_ajar == props.tahun_ajar).length == 0)
                        &&
                        <button className='btn btn-success' onClick={ () => generateMapel() }>Generate Mapel Lama</button>
                    }
                </div>
                <div className="card-tools col-1 d-flex justify-content-end">
                    <button type="button" className="btn btn-tool" data-card-widget="collapse">
                        <i className="fas fa-minus" />
                    </button>
                    <button type="button" className="btn btn-tool" data-card-widget="remove">
                        <i className="fas fa-times" />
                    </button>
                </div>
            </div>
            <div className="card-body p-2 overflow-auto" style={ { height: 500 } }>
                {
                    kelas.filter(({ tahun_ajar }) => tahun_ajar == props.tahun_ajar).map((val, index) => (
                        <div className="p-3" key={ index }>
                            <span>Progress Rapor Kelas { val.kelas + val.nama_kelas }: </span>
                            <div className='d-flex'>
                                <div>
                                    <span>Wali Kelas</span>
                                </div>
                                <div style={ { width: 20 } }>
                                    <span>:</span>
                                </div>
                                <div>
                                    {
                                        guru.filter(({ id }) => id == val.id_guru).map((value, index) => (
                                            <span key={ index }>
                                                { value.nama }
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="row p-3">
                                <progress className="progress is-success col-10 mt-1" title={ dataProgres[index] + "%" } value={ dataProgres[index] } max={ 100 } />
                                <p className='col-1'>{ dataProgres[index] }%</p>
                                {
                                    (dataProgres[index] < 100)
                                        ?
                                        <div className="col-1">
                                            <i className="fa-solid fa-square-xmark">
                                            </i>
                                        </div>
                                        :
                                        <div className="col-1">
                                            <i className="fa-solid fa-square-check"></i>
                                        </div>
                                }
                            </div>
                        </div>
                    ))
                }

                <div className={ 'd-flex justify-content-end ' }>
                    <div className={ 'w-25 d-flex justify-content-center ' }>
                        <div className={ (ajaranBaru) ? '' : 'd-none' }>
                            <button className={ 'btn btn-warning' } onClick={ () => gantiAjaranBaru() }>Ganti Ajaran Baru</button>
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
        handlePicture: (exp) => dispatch({ type: ActionType.SET_PICTURE_USER, index: exp }),
        handleRole: (role) => dispatch({ type: ActionType.SET_ROLE_USER, index: role }),
        handleTahunAjar: (tahun) => dispatch({ type: ActionType.SET_TAHUN_AJAR, index: tahun })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgresRapor)