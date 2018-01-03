# 接口层基类(Service)

## 简介

用于派生业务接口类使用

`Service`类继承于[`Network`](/app/framework/network)所以具备`Network`的所有特性

#### 如何派生一个子类？

> 例如下面定义`user`的业务接口类定义

```js

  import Service from 'framework';

  class UserService extends Service{
    constructor(){
    }
    /**
     * 登录接口
     * @param {String} code
     */
    login(usernmae,password) {
      return this.post('/user/login', { usernmae,password});
    }
  }
  //创建一个接口实例，并且作为exports公布出去
  module.exports = new UserService();
```

#### 如何使用?

> 引用模块，直接调用接口函数即可

```js
  import { User }  from './octopus';

  User
    .login({count:20})
    .then((data)=>{
      //这里处理返回的数据
    })
    .catch((error)=>{
      //这里处理返回异常
    })
```