import "./index.css";
import React from 'react'
import Component from '../../../components/base';
import { Flex,View,Text } from 'antd-mobile';

class IndexScreen extends Component {

  constructor(props) {
    super(props)
    this.navigate = this.props.navigation.navigate.bind(this.props.navigation)
  }

  componentDidMount(){
    clearTimeout(this.timer);
    this.timer =  setTimeout(()=>this.forward('Login'),5000);
  }

  /**
   * 渲染组件
   */
  render() {
    return (
      <Flex className="splash-screen">
        <Flex.Item className="logo">
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
