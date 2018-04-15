import "./home.css"
import React from 'react';
import { Base, Layout } from 'components';
import { Flex, Text } from 'antd-mobile'; //sss

export default class HomeScreen extends Base {

  static navigationOptions = {
    title: '首页',
  }

  constructor(props) {
    super(props);
    //如果使用微信分享
    //this.connectionWechat(['onMenuShareTimeline']);
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

  render() {
    return (
      <Layout>
        <Flex className="home-screen">
          <Flex.Item className="logo">
            <Text>Welcome ! ${this.routeParams.name}{this.routeParams.age}</Text>
          </Flex.Item>
        </Flex>
      </Layout>
    )
  }
}