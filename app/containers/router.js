import { StackNavigator } from 'hanzojs/router'

module.exports = (modules) => {
  StackNavigator.setPathExtension('.html',process.env.NODE_ENV === 'production' ? 'web/weixin' : 'web/weixin');
  return StackNavigator({
    Root: {
      path: '',
      rest:true,
      screen: StackNavigator({
        Index: {
          screen: modules.Index,
          path: '',
          navigationOptions: {
            title: 'Pendragon'
          }
        },
        Login: {
          screen: modules.UserLogin,
          path: 'login',
          navigationOptions: {
            title: '登录'
          }
        },
        Home: {
          screen: modules.Home,
          path: 'index',
          navigationOptions: {
            title: '首页'
          }
        }
      })
    }
  })
}
