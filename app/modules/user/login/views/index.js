import "./index.css"
import React from 'react';
import Component from '../../../../components/base';
import { View, Text,Button,InputItem } from 'antd-mobile'

// 校验规则
const partten = {
  username: { required: '请输入用户名' },
  password: { required: '请输入密码' }
}

class UserLoginScreen extends Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * 登陆业务
   */
  handleSubmit() {
    this.props.login('beven','123456');
  }

  // 跳转到注册页面
  goIndex() {
    return this.props.navigation.navigate('Index', { name: 'Reading' })
  }
  
  /**
   * 渲染组件
   */
  render() {
    return (
      <View className="login">
        <InputItem ref="userName" className="login-input">用户名:</InputItem>
        <Button onClick={this.handleSubmit}>
          <Text>登陆</Text>
        </Button>
      </View>
    )
  }
}

module.exports = UserLoginScreen


/**
 * 
1  能否在index.js中     render()方法中 直接写 字符串（如元素中的样式 src路径等） 如何引用 本类静态方法 。

答： 
    1.1 应用静态类方法 : 通过类名.方法名的形式(....)   例如:
    class User{

      static getInstance(){
        return new User();
      }

    }

    var instance = User.getIntance();

  1.2 render方法中，元素样式 
     
      不推荐直接写在元素上 例如: <Button style={{color:'red'}}  />
   
      推荐通过className来书写样式 例如 <Button className="mybtn"/>

      然后一个页面定义一份css 例如 index.css 在index.css书写样式 

      例如:
      import "./index.css";

      class LoginScreen{

          render(){

            return (
              <Button className="login-btn" onClick={....}/>
            )

          }
      }

      //index.css
      .login-btn{
        color:#fff;
        backgroundColor:red;
      }
      
  1.3 图片引用
     <img src={ require('./images/bg.png') }/>    

     或者
     <img src={state.imgUrl}  />



2.如何处理 图片文件 ，方法是什么？

答： 图片引用
     <img src={ require('./images/bg.png') }/>    

     或者
     <img src={state.imgUrl}  />

3。如何实现 ajax交互 ， 具体流程如何？ 是否可以做挡板数据。与后台交互如何实现拦截功能？

答：
  
   ajax交互 参见本页面的demo 
    

4。返回数据如何处理？是否为json数据。

答： 框架自带的网络工具支持不同数据的传递，以及处理不同数据返回

    4.1 返回json格式数据处理
        const userService = new UserService();
        return userService.userLogin({password,username}).showLoading().json();
       //通过调用.json()函数来处理返回数据为json格式

    4.2 请求数据格式 默认为 application/x-www-form-urlencoded 
        如果默认需要设置成json 
        可以修改/components/network/index.js 的adapter函数设置的默认类型
        
5。页面布局如何改为 响应式布局。

答：    默认框架自带响应式处理工具，只需要统一按照iphone6的尺寸来调试页面就可以了

    关于书写的布局样式单位： 你只需要书写 px单位就可以了 框架会默认处理成rem单位

6.全局变量如何实现。

答： 不推荐全局变量，因为全局变量来源不好追踪，且容易被变量污染

    推荐定义一个通用的模块js,来代替全局变量 例如:
    在app/目录下定义一个目录
    app/common/constants.js  

    然后需要用到这些定义的常量等参数，可以引用这个js

    另外，推荐将一些常用的对象，可以定义在基类中，这样可以避免子类都需要import 

    例如：将部分通用的属性定义在 components/base/index.js 的页面基类中
    

7.局部变量是否只能在构造器中初始化？

答：
   局部变量可以在任意地方定义，看设计需要

 */