import { UserService } from '../../../api';

const userService = new UserService();

class UserActions {
    
    login(userName, password) {
        return userService.ajaxLogin(userName, password).showLoading('请稍后...').redux();
    }
}

module.exports = new UserActions();

