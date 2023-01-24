import React from 'react'
import axios from '../api/axios'
import { connect } from 'react-redux'

const api = (props) => {

    const axiosJWT = axios.create()


    const getKelas = async () => {
        try {
            const response = await axiosJWT.get('/kelas', {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            })
            return (response.data)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        getKelas()
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(api)