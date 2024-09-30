import request from '../utils/request/';

export default {
    recruitList: (params) => request.get('/api/yibum/post/page', { ...params }),
    shopList: (params) => request.get('/api/yibum/basicInformation/shopBranch/page', { ...params }),
}
