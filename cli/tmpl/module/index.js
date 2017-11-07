import { connect } from 'hanzojs/mobile'
import model from './model'

module.exports = {
  models: model,
  views: {
    $name$: connect((state) => ({ ...state.$state$ }), model)(require('./views'))
  }
}
