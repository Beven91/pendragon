import "./index.css";
import React from 'react'
import Component from '../../../components/base';
import { Flex,View,Text,Button,Toast,Icon } from 'antd-mobile';

class IndexScreen extends Component {

  constructor(props) {
    super(props)
    this.navigate = this.props.navigation.navigate.bind(this.props.navigation)
    this.gotoLogin =  this.gotoLogin.bind(this);
    //Toast.show("你好",10000000);
      //如果使用微信分享
    this.connectionWechat(['onMenuShareTimeline']);
  }

   //微信相关操作
   onWechatConnection(wx) {
    //前提：使用了 this.connectionWechat 
    //使用了this.connectionWechat  后触发当前函数
    const share = {
        title: '送您一张...卡',
        desc: '...',
        link: 'https://s.com/xxx',
        imgUrl: this.shareLogoUrl
    }
    wx.onMenuShareTimeline(share);
}

  componentDidMount(){
  }

  gotoLogin(){
    this.forward('Login');
  }

  /**
   * 渲染组件
   */
  render() {
    return (
      <Flex className="splash-screen">
        <Flex.Item className="logo">
          <Icon type="search" size="xs"/>
          <Button onClick={this.gotoLogin} >登录</Button>
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
