import request from '../utils/request/';

export default {
    recruitList: (params) => request.get('/api/yibum/post/page', { ...params }),
    workorderPatternList: (params) => request.post('/api/workorder/pattern/list', { ...params }),
    workorderLogin: (params) => request.post('/api/oa/auth/jwt/token', {...params})
}
