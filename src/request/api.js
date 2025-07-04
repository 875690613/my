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
    myStyleList: (params) => request.post('/api/myStyle/myStyleList', { ...params }),
    conllectionPurchaseList: (params) => request.post('/api/myStyle/conllectionPurchaseList', { ...params }),
    conllectionPurchaseDetail: (params) => request.get('/api/myStyle/conllectionPurchaseDetail', { ...params }),
    purchaseStockList: (params) => request.post('/api/myStyle/purchaseStockList', { ...params }),
    conllectionProductList: (params) => request.post('/api/myStyle/conllectionProductList', { ...params }),
    conllectionProductDetail: (params) => request.get('/api/myStyle/conllectionProductDetail', { ...params }),
    productStyleList: (params) => request.post('/api/myStyle/productStyleList', { ...params }),
    conllectionAllocationList: (params) => request.post('/api/myStyle/conllectionAllocationList', { ...params }),
    clientAddresses: (params) => request.post('/api/myStyle/clientAddresses', { ...params }),
    clientRecord: (id) => request.get(`/api/myStyle/clientRecord?id=${id}`),
    clientProduct: (params) => request.post(`/api/myStyle/clientProduct`, { ...params }),
    clientContract: (params) => request.post(`/api/myStyle/clientContract`, { ...params }),
    balance: (contractId) => request.get(`/api/myStyle/balance?contractId=${contractId}`),
    purchaseDetail: (contractId) => request.get(`/api/myStyle/purchaseDetail?contractId=${contractId}`),

    // 优秀员工体检H5页面 2024-11-28
    // 人员工号登录 ==>档案管理 staff_no
    staffCodeLogin: (params) => request.post('/api/auth/jwt/staff/token', {...params }),
    // 验证当前人员是否是优秀员工
    checkIsExcellent: (params) => request.get('/api/oa/user/excellent/checkup/isExcellentPeople', { ...params }),
    // 报名优秀员工体检
    applyExcellentPeople: (params) => request.post('/api/oa/user/excellent/checkup/add', { ...params }),
    // 优秀员工体检查询列表
    excellentPeopleList: (params) => request.post('/api/oa/user/excellent/checkup/read/page', {...params }),
    // 优秀员工体检报名详情
    excellentPeopleDetail: (params) => request.get('/api/oa/user/excellent/checkup/read/detail', {...params }),
}
