import "./index.css";
import React from 'react'
import Component from '../../../components/base';
import CountdownButton from '../../../components/countdown'
import { Flex,View,Text,Button } from 'antd-mobile';

class IndexScreen extends Component {

  constructor(props) {
    super(props)
    this.navigate = this.props.navigation.navigate.bind(this.props.navigation)
    this.gotoLogin =  this.gotoLogin.bind(this);
  }

  componentDidMount(){
  }

  gotoLogin(){
   // this.forward('Login');
  }

  /**
   * 渲染组件
   */
  render() {
    return (
      <Flex className="splash-screen">
        <Flex.Item className="logo">
          <CountdownButton format="{0}秒后重新发送" total={5} timerCls="disabled" onClick={this.gotoLogin} >登录</CountdownButton>
          <Text>Pendragon</Text>
        </Flex.Item>
      </Flex>
    )
  }
}

const styles = ({
  container: {
    paddingLeft: 30,
    paddingRight: 30,
    flex: 1,
    justifyContent: 'center',
  },
  fontColor: {
    color: '#fff',
  },
  href: {
    backgroundColor: '#e44c3c',
    borderWidth: 0,
    marginBottom: 15
  }
})

module.exports = IndexScreen
