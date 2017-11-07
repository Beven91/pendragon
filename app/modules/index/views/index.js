import React from 'react'
import Component from '../../../components/base';
import { Button,Text,View } from 'antd-mobile';

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
      <View style={styles.container}>
        <Button style={styles.href} activeStyle={false} onClick={() => this.navigate('Login')}>
          <Text style={styles.fontColor}>登陆</Text>
        </Button>
        <Button style={styles.href} onClick={() => this.navigate('Register')}>
          <Text style={styles.fontColor}>注册</Text>
        </Button>
        <Button style={styles.href} onClick={() => this.navigate('Antd')}>
          <Text style={styles.fontColor}>antd使用</Text>
        </Button>
      </View>
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
