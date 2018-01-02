import React from 'react'
import { Base,Layout } from 'components';
import { View } from 'antd-mobile';

export default class $name$Screen extends Base {

  constructor(props) {
    super(props)
  }

  /**
   * 渲染组件
   */
  render() {
    return (
      <View onClick={this.props.submit}>$name$</View>
    )
  }
}