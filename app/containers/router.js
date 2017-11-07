import { StackNavigator } from 'hanzojs/router'
 
module.exports = (modules) => {
  return StackNavigator({
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
    }
  })
}
