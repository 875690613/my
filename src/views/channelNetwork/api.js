import request from '@/utils/request';

export default {
    getChannelList: (params) => request.get('/api/yibum/channel/page', {...params})
}
