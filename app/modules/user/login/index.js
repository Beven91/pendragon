import { connect } from 'hanzojs/mobile'
import model from './model'

module.exports = {
  models: model,
  views: {
    UserLogin: connect((state) => ({ ...state.user.login }), model)(require('./views'))
  }
}
