import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import refreshToken from '../../../config/token/refreshToken'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import ActionType from '../../../redux/reducer/globalActionType'

const authLogin = (props) => {
    const navigate = useNavigate()

    const [nama, setNama] = useState()
    const [token, setToken] = useState()
    const [exp, setExp] = useState()


    useEffect(() => {
        refreshToken()
    }, [])

    props.handleName(nama)
    props.handleExp(exp)
    props.handleToken(token)

    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date()
        if (props.expired * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:7000/token')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            props.handleToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            props.handleExp(decoded.exp)
            props.handleName(decoded.name)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })



    // const getUser = async () => {
    //     const response = await axiosJWT.get('http://localhost:7000/users', {
    //         headers: {
    //             Authorization: `Bearer ${props.token}`
    //         }
    //     })
    //     // setUsers(response.data)
    // }

    console.log(props.token);
    console.log(props.name);
    console.log(props.exp);
}

const mapStateToProps = state => {
    return {
        name: state.user,
        token: state.token,
        expired: state.expired
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleName: (nama) => dispatch({ type: ActionType.SET_NAME_USER, index: nama }),
        handleToken: (token) => dispatch({ type: ActionType.SET_TOKEN_USER, index: token }),
        handleExp: (exp) => dispatch({ type: ActionType.SET_EXPIRED_USER, index: exp })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(authLogin)