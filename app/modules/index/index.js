import { connect } from 'hanzojs/mobile'
import model from './model'
 
module.exports = {
  models: model,
  views: {
    Index: connect((state) => ({ ...state.index }), model)(require('./views'))
  }
}
