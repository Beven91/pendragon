import { login } from './action'

module.exports = {
  namespace: 'user/login',
  state: {
    loging: false,
    message: null,
    status: null
  },
  handlers: [
    { name: 'login', action: login }
  ],
  reducers: {
    login_Loading:(state,action)=>{
      return {
        ...state,
        loging: true
      }
    },
    login_Error:(state,action)=>{
      return {
        ...state,
        loging: false
      }
    },
    login_Success:(state,action)=>{
      return {
        ...state,
        ...action.payload,
        loging:false,
      }
    }
  },
}
