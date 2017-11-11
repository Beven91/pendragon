import React from 'react'
import Component from '../../../components/base';
import { Button,Text,View, WhiteSpace, WingBlank } from 'antd-mobile';

class IndexScreen extends Component {

  constructor(props) {
    super(props)
    this.navigate = this.props.navigation.navigate.bind(this.props.navigation)
  }

  /**
   * 渲染组件
   */
  render() {
    return (
      <WingBlank>
      <Button>default</Button><WhiteSpace />
      <Button disabled>default disabled</Button><WhiteSpace />
  
      <Button type="primary">primary</Button><WhiteSpace />
      <Button type="primary" disabled>primary disabled</Button><WhiteSpace />
  
      <Button type="warning">warning</Button><WhiteSpace />
      <Button type="warning" disabled>warning disabled</Button><WhiteSpace />
  
      <Button loading>loading button</Button><WhiteSpace />
      <Button icon="check-circle-o">with icon</Button><WhiteSpace />
      <Button icon={<img src="https://gw.alipayobjects.com/zos/rmsportal/jBfVSpDwPbitsABtDDlB.svg" alt="" />}>with custom icon</Button><WhiteSpace />
  
      {/* <Button activeStyle={false}>无点击反馈</Button><WhiteSpace /> */}
      {/* <Button activeStyle={{ backgroundColor: 'red' }}>custom feedback style</Button><WhiteSpace /> */}
  
      <WhiteSpace />
      <Button type="primary" inline style={{ marginRight: '4px' }}>inline primary</Button>
      {/* use `am-button-borderfix`. because Multiple buttons inline arranged, the last one border-right may not display */}
      <Button type="ghost" inline style={{ marginRight: '4px' }} className="am-button-borderfix">inline ghost</Button>
  
      <WhiteSpace />
      <Button type="primary" inline size="small" style={{ marginRight: '4px' }}>primary</Button>
      <Button type="primary" inline size="small" disabled>primary disabled</Button>
      <WhiteSpace />
      <Button type="ghost" inline size="small" style={{ marginRight: '4px' }}>ghost</Button>
      {/* use `am-button-borderfix`. because Multiple buttons inline arranged, the last one border-right may not display */}
      <Button type="ghost" inline size="small" className="am-button-borderfix" disabled>ghost disabled</Button>
    </WingBlank>
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
