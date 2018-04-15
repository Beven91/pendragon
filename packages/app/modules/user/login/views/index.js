import "./index.css"
import React from 'react';
import { Base, Layout } from 'components';
import { View, Text, Button, InputItem } from 'antd-mobile'

// 校验规则
const partten = {
  userName: { required: '请输入用户名' },
  password: { required: '请输入密码' }
}

class UserLoginScreen extends Base {

  static navigationOptions = {
    title: '登录',
  }

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * 登陆业务
   */
  handleSubmit() {
    const user = {
      userName: this.userRef.state.value,
      password: this.passwordRef.state.value
    }
    if (this.modelValidation(user, partten)) {
      this.props.login(user.userName, user.password);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { code, message, name } = nextProps;
    if (code === 0) {
      this.forward('Home', { name: name, age: 20 });
    } else if (message) {
      this.showTip(message)
    }
  }

  /**
   * 渲染组件
   */
  render() {
    return (
      <Layout>
        <View className="login-screen">
          <img src="http://localhost:3003/user/login?v=242343" />
          <View className="logo">Pendragon</View>
          <InputItem ref={(e) => this.userRef = e} className="login-input">用户名:</InputItem>
          <InputItem type="password" ref={(e) => this.passwordRef = e} className="login-input">密码:</InputItem>
          <Button className="btn-submit" onClick={this.handleSubmit}>
            <Text>登陆</Text>
          </Button>
        </View>
      </Layout>
    )
  }
}

module.exports = UserLoginScreen