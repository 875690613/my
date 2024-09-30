import request from '../utils/request/';

export default {
    recruitList: (params) => request.get('/api/yibum/post/page', { ...params }),
    workorderPatternList: (params, config) => request.post('/api/workorder/pattern/list', { ...params }, {...config}),
    workorderLogin: (params) => request.post('/api/auth/jwt/token', {...params})
}
