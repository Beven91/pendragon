import { login } from './action'

module.exports = {
  namespace: 'user/login',
  state: {
    code:-1,
    message:''
  },
  handlers: [
    { name: 'login', action: login }
  ],
  reducers: {
    login_Loading(state,action){
      return {
        ...state,
        code:-1,
        message:''
      }
    },
    login_Success:(state,action)=>{
      return {
        ...state,
        ...action.payload
      }
    }
  },
}
