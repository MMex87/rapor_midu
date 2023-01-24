import axios from 'axios'
import jwt_decode from 'jwt-decode'

const refreshToken = async () => {
    try {
        const response = await axios.get('http://localhost:7000/token')
        const token = response.data.accessToken
        return {
            token
        }
    } catch (error) {
        return (error.name);
    }
}

export default refreshToken