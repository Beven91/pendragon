import { UserService } from '../../../api';

const userService = new UserService();

class UserActions {
    
    login() {
        return userService.ajaxLogin(userName, password).showLoading().redux();
    }
}

module.exports = new UserActions();

