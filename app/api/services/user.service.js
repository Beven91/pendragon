import Network from '../base';

export default class UserService extends Network {

    ajaxLogin(name, password) {
        return this.post('/user/login', { name, password }).then((r) => r.json());
    }

}