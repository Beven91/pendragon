import { Service } from 'framework';

export default class WechatService extends Service {

    permission(data) {
        return this.post('/wechat/permission', data).json();
    }

}