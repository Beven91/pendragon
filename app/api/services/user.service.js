import { Service } from 'framework';

export default class UserService extends Service {

    ajaxLogin(name, password) {
        return this.get('user/login', { name, password }).then((r) => r.json());
    }

}