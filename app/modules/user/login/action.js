import { UserService } from '../../../api/index';

const userService = new UserService();

module.exports = {
    login(userName, password) {
        return { promise: userService.ajaxLogin(userName, password) }
    }
}

