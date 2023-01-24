import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:9076/'
// axios.defaults.baseURL = 'https://raportmidu.layhomedev.site/api/'
// axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers['Access-Control-Allow-Methods'] = 'GET ,POST ,PUT,PATCH,DELETE,OPTIONS';
// axios.defaults.headers['Access-Control-Allow-Headers'] = 'Content-type, Authorization';

export default axios