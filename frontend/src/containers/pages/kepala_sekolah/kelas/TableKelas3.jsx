import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionType from '../../../../redux/reducer/globalActionType'
import axios from '../../../../api/axios'
import jwt_decode from 'jwt-decode'
import { connect } from 'react-redux'
import { jsPDF } from "jspdf"
import autoTable from 'jspdf-autotable'

export const TableKelas3 = (props) => {
    const Nkelas = '3'
    // deklarasi hooks dan axios
    const navigate = useNavigate()
    const axiosJWT = axios.create()

    // state Data
    const [kelas, setKelas] = useState([])
    const [guru, setGuru] = useState([])
    const [siswa, setSiswa] = useState([])


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

    // handle Download pdf
    const handlePDF = (val, guru, namaKelas) => {
        // Deklarasi PDF
        const doc = new jsPDF("l", "pt", "a4")

        doc.text(`Data Kelas ${Nkelas}${namaKelas}`, 38, 20)
        doc.text(`Wali Kelas : ${guru}`, 38, 50)

        autoTable(doc, {
            margin: { top: 70 },
            head: [['Id', 'Nama', 'NISN', 'NIS']],
            body: siswa.filter(({ id_kelas }) => id_kelas == val),
            columns: [
                { headers: "Id", dataKey: "id" },
                { headers: "Nama", dataKey: "nama" },
                { headers: "NISN", dataKey: "nisn" },
                { headers: "NIS", dataKey: "nis" }
            ],
            theme: 'striped' | 'grid' | 'plain' == 'striped'
        })

        window.open(doc.output("bloburl"));
        doc.save(`Data Kelas ${Nkelas}${namaKelas}.pdf`)
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
        <>
            <div className="container-fluid">
                {/* /.row */ }
                <div className="row">
                    <div className="col-12">
                        <div className="card collapsed-card">
                            <div className="card-header row">
                                <h3 className="card-title col-4">Data Kelas { Nkelas }</h3>
                                <div className="col-7"></div>
                                <div className="col-1 d-flex justify-content-end card-tools">
                                    <button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-plus"></i>
                                    </button>
                                    <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                                    </button>
                                </div>
                            </div>
                            <div className="card-body row">
                                { kelas.filter(({ kelas }) => kelas == Nkelas).map((val, index) => (
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
                                                {
                                                    guru.filter(({ id }) => id == val.id_guru).map((value) => (
                                                        <div className="row mb-3">
                                                            <div className="col-md-3">
                                                                Wali Kelas
                                                            </div>
                                                            <div className="col-md-1">:</div>
                                                            <div className="col-md-6">
                                                                {
                                                                    value.nama
                                                                }
                                                            </div>
                                                            <div className="col-md-1">
                                                                <button className='btn btn-success btn-sm' onClick={ () => handlePDF(val.id, value.nama, val.nama_kelas) } >Download</button>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                                <div class="card-body table-responsive p-0" style={ { height: 200 } } id={ 'kelas' + val.id }>
                                                    <table className="table table-hover table-head-fixed table-dark text-nowrap" >
                                                        <thead>
                                                            <tr>
                                                                <th style={ { backgroundColor: '#fff' } }>No</th>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableKelas3)