import { connect } from 'hanzojs/mobile'
import model from './model'
import $name$Screen from './views';

module.exports = {
  models: model,
  views: {
    $name$: connect((state) => ({ ...state.$state$ }), model)($name$Screen)
  }
}
