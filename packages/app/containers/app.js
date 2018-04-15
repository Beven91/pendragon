import React from 'react';
import Hanzo from 'hanzojs/mobile'
import { Venylog } from 'components';
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'

const App = new Hanzo({ isomorphic: true })

//模块注册
App.registerModule(require('../modules/index'))
App.registerModule(require('../modules/user/login/index'));

// redux中间件
App.use({
  onAction: [
    promiseMiddleware({
      promiseTypeSuffixes: ['Loading', 'Success', 'Error']
    }),
    thunkMiddleware
  ]
})

// 路由注册
App.router(require('./router'))

const Pendragon = App.start()

class PendragonApp extends React.Component {
  render() {
    return (
      <Venylog>
        <Pendragon />
      </Venylog>
    )
  }
}

export default PendragonApp;