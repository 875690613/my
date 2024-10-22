import request from '../utils/request/';

export default {
    recruitList: (params) => request.get('/api/yibum/post/page', { ...params }),
    workorderPatternList: (params, config) => request.post('/api/workorder/pattern/list', { ...params }, {...config}),
    workorderLogin: (params) => request.post('/api/auth/jwt/token', {...params}),
    shopList: (params) => request.get('/api/yibum/basicInformation/shopBranch/page', { ...params }),
    brandList: (params) => request.post('/api/myStyle/brandConllectionList', { ...params }),
    clientList: (params) => request.get('/api/sys/getClient', { ...params }),
    queryBrand: (params) => request.get('/api/sys/getClientLinkByClient', { ...params }),
    brandConllectionDetail: (params) => request.get('/api/myStyle/brandConllectionDetail', { ...params }),
    myStyleList: (params) => request.get('/api/myStyle/myStyleList', { ...params }),
}
