import Service from './base';

export default class UserService extends Service {

    ajaxLogin(name, password) {
        return this.post('user/login', { name, password }).then((r) => r.json());
    }

}