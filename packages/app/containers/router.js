import { Navigator } from 'components';

const { Router } = Navigator

module.exports = (views) => {
  return Router({
    Index: { path: '/', screen: views.Index },
    Login: { path: 'login', screen: views.UserLogin },
    Home: { path: 'home/:name', screen: views.Home },
  }, 'hash')
}