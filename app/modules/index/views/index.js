import "./index.css";
import React from 'react'
import { Base } from 'components';
import { Flex, View, Text, Button, Toast, Icon } from 'antd-mobile';

class IndexScreen extends Base {

  static navigationOptions = {
    title: '欢迎您',
  }

  constructor(props) {
    super(props)
    this.navigate = this.props.navigation.navigate.bind(this.props.navigation)
    this.gotoLogin = this.gotoLogin.bind(this);
  }

  gotoLogin() {
    this.forward('Login');
  }

  /**
   * 渲染组件
   */
  render() {
    return (
      <Flex className="splash-screen">
        <Flex.Item className="logo">
          <Button onClick={this.gotoLogin} >登录</Button>
          <Text>Pendragon</Text>
        </Flex.Item>
      </Flex>
    )
  }
}

module.exports = IndexScreen
