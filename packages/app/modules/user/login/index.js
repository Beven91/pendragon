import { connect } from 'hanzojs/mobile'
import model from './model'
import LoginScreen from './views/index';
import HomeScreen from './views/home'; //

module.exports = {
  models: model,
  views: {
    UserLogin: connect((state) => ({ ...state.user.login }), model)(LoginScreen),
    Home: connect((state) => ({...state}), {})(HomeScreen),
  }
}
