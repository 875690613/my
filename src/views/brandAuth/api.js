import request from '@/utils/request';

export default {
    getBrandAuth: (params) => request.get('/api/yibum/basicInformation/shop/getBrandAuth', {...params}),
    getBrandList: (params) => request.get('/api/yibum/p/brand/page', {...params})
}
