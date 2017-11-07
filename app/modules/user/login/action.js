import { UserService } from '../../../api/index';

const userService = new UserService();

class UserActions {
    
    login() {
        return userService.ajaxLogin(userName, password).showLoading().redux();
    }
}

module.exports = new UserActions();

