import { StackNavigator } from 'hanzojs/router'

module.exports = (modules) => {
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
          path: 'home',
          navigationOptions: {
            title: '首页'
          }
        }
      })
    }
  })
}
