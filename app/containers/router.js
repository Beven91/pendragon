import { StackNavigator } from 'hanzojs/router'

const Route = (path, screen, title) => {
  return { screen, path, navigationOptions: { title } }
}

module.exports = (modules) => {
  return StackNavigator({
    Root: {
      path: '',
      rest: true,
      screen: StackNavigator({
        Index: Route('', modules.Index, 'Pendragon'),
        Login: Route('login', modules.UserLogin, '登录'),
        Home: Route('home', modules.Home, '首页'),
      })
    }
  })
}