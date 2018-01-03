# components

自定义二方组件

###### 目前有以下组件

- `base` (基础组件类，用于提供相关通用函数)

- `error` (用于提供异常捕获，以及设备脚本异常提示)

- `layout` (母版页组件)

- `navigator` (导航组件)

- `preload` (自定义Loading组件)

- `venylog` (数据打点组件)

- `wechat` (微信sdk)

## 关于按需加载

当前模块支持`webpack`按需打包，
使用的插件是[`babel-plugin-import`](https://github.com/ant-design/babel-plugin-import)进行按需配置

### 需要注意命名

在`index.js`中的`export`模块名需要与模块对应的`文件名`保持以下关系

- 如果`export`模块名不是驼峰命名 则文件名与`模块名`保持一致(不区分大小写) 如下案例

例如: `Network`  则文件名命名为: `network.js`

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

- 如果`export`模块名不是驼峰命名 则文件名与按照驼峰拆分后按照`-`号链接

例如: `NetworkAny`  则文件名命名为: `network-any.js`

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