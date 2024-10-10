import axios from 'axios'

axios.defaults.timeout = 40000;

axios.interceptors.request.use(
    config => {
        let Authorization = localStorage.getItem('Authorization');
        if (Authorization) {
            config.headers.Authorization = Authorization
        }
        
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

export default {
    /**
     * get 请求
     * @param {string} url 接口地址
     * @param {object} params 请求参数
     * @param {object} config 配置项
     */
    get(url, params={}, config={}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: url,
                params,
                ...config
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err.data)
            })
        })
    },

    /**
     * post请求
     * @param {string} url 接口地址
     * @param {object} data 请求参数
     * @param {object} config 配置项
     */
    post(url, data={}, config={}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: url,
                data,
                ...config
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err.data)
            })
        })
    },

    /**
     * put 请求
     * @param {string} url 接口地址
     * @param {object} data 请求参数
     * @param {object} config 配置项
     */
    put(url, data={}, config={}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'put',
                url: url,
                data,
                ...config
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err.data)
            })
        })
    }
}