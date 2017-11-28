import React from 'react'
import Component from '$rb$';
import { View } from 'antd-mobile';

export default class $name$Screen extends Component {

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