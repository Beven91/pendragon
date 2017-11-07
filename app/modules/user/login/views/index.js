import React from 'react';
import Component from '../../../../components/base';
import { View, Text,Button } from 'antd-mobile'

// 校验规则
const partten = {
  username: { required: '请输入用户名' },
  password: { required: '请输入密码' }
}

class UserLoginScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  /**
   * 登陆业务
   */
  handleSubmit() {
    this.props.login('beven','123456');
  }

  // 跳转到注册页面
  goIndex() {
    return this.props.navigation.navigate('Index', { name: 'Reading' })
  }

  /**
   * 渲染组件
   */
  render() {
    return (
      <View >
        <Button  onClick={() =>this.handleSubmit() }>
          <Text>登陆</Text>
        </Button>
      </View>
    )
  }
}

const styles2 = {
  redblock: {
    backgroundColor: '#e44c3c',
    borderWidth: 0,
  }
}

module.exports = UserLoginScreen
