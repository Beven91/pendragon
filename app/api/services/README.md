# services

业务接口存放模块，项目所有接口都定义在此处。

## 如何定义一个Service

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

## 如何使用?

> 引用模块，直接调用接口函数即可

```js
  import { User }  from './user';

  User
    .login({count:20})
    .then((data)=>{
      //这里处理返回的数据
    })
    .catch((error)=>{
      //这里处理返回异常
    })
```

## 关于按需加载

当前模块支持`webpack`按需打包，
使用的插件是[`babel-plugin-import`](https://github.com/ant-design/babel-plugin-import)进行按需配置

### 需要注意命名

在`index.js`中的`export`模块名需要与模块对应的`文件名`保持以下关系

#### 如果`export`模块名不是驼峰命名 则文件名与`模块名`保持一致(不区分大小写) 如下案例

> 例如: `Network`  则文件名命名为: `network.js`

> index.js

```js
  import Network from './network'

  export {
    //Network名称与他的模块文件名保持一致 'network.js'
    Network
  }
```

> network.js

```js
  export default class Network{
  }
```

#### 如果`export`模块名不是驼峰命名 则文件名与按照驼峰拆分后按照`-`号拼接

> 例如: `NetworkAny`  则文件名命名为: `network-any.js`

> index.js

```js
  import NetworkAny from './network-any'

  export {
    NetworkAny
  }
```

> network-any.js

```js
  export default class NetworkAny{
  }
```
