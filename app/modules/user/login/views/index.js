import "./index.css"
import React from 'react';
import Component from '../../../../components/base';
import Layout from '../../../../components/layout';
import { View, Text, Button, InputItem } from 'antd-mobile'

// 校验规则
const partten = {
  userName: { required: '请输入用户名' },
  password: { required: '请输入密码' }
}

class UserLoginScreen extends Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * 登陆业务
   */
  handleSubmit() {
    const { username, password } = this.refs;
    const user = {
      userName: username.state.value,
      password: password.state.value
    }
    if (this.modelValidation(user, partten)) {
      this.props.login(user.userName, user.password);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { code, message,name } = nextProps;
    if (code === 0) {
      this.forward('Home',{name:name});
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
          <View className="logo">Pendragon</View>
          <InputItem ref="username" className="login-input">用户名:</InputItem>
          <InputItem type="password" ref="password" className="login-input">密码:</InputItem>
          <Button className="btn-submit" onClick={this.handleSubmit}>
            <Text>登陆</Text>
          </Button>
        </View>
      </Layout>
    )
  }
}

module.exports = UserLoginScreen