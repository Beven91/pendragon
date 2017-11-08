import { UserService } from '../../../api';

const userService = new UserService();

class UserActions {
    
    login(userName, password) {
        return userService.ajaxLogin(userName, password).showLoading().redux();
    }
}

module.exports = new UserActions();

