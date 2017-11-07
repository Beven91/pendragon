import Hanzo from 'hanzojs/mobile'
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

export default App;