/**
 * @name 母版页组件
 * @date   2017-11-11
 * @description  用于提供页面基础配置，例如头部，底部等
 */
import './index.css';
import React from 'react';
import Component from '../base';
import { View } from 'antd-mobile';

export default class Layout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View className="layout">
        {this.props.children}
      </View>
    )
  }
}