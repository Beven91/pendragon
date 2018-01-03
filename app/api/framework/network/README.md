# 通用接口库(Network)

## 简介

基于`fetch`装类的接口访问类

可以进行全局接口请求监听,返回结果扩展(`AttachResponse`)，支持`promise` 以及`loading`效果 

`支持重试机制`

## 使用介绍

###### 引用网络模块

```js
  import { Network } from 'framework';
```

###### 初始化网络模块

```js
  //全局配置
  Network.config({
    //基础url部分
    baseUri: 'http://m.api.com/rest',
    //当希望接口请求时出现一个loading效果时，可以定义次参数，控制如何显示loading消息
    //注意：loading函数需要返回一个关闭loading效果的函数 例如 function loading(){  showLoading();return hideLoading;     }
    loading: Preload.hideLoading.bind(Preload)
  })
  //全局事件监听
  Network.on('error',()=>{  /*这里可以统一处理所有接口异常*/   })
```

###### 发起`GET`请求

通过`network.get`发起GET请求

```js
  const network  = new Network();
  //get请求
  network
    .get('/getOrders',{size:20},/*可以自定义headers*/headers)
    .then((data)=>{
      //处理接口返回结果
     })
     .catch((error)=>{
       //额外处理接口异常，当然也可以在Network.on('error')统一处理，这样就无需使用catch
     })
```

###### 发起`POST`请求

通过`network.post`发起POST请求

```js
  const network  = new Network();
  network
    .post('/getOrders',{size:20},/*可以自定义headers*/headers)
    .then((data)=>{
      //处理接口返回结果
     })

```

###### 自定义请求

通过`network.any`发起任意类型的请求

```js
  const network  = new Network();
  //自定义请求
  network
    // uri,data,method,headers
    .any('/createOrder',{mount:999},'PUT',{'cookie':'xxx'})
    .then((data)=>{
      //处理接口返回结果
     })
```

###### 关于loading效果

希望发起请求同时出现loading效果，并且接口完毕后隐藏loading效果

通过链式调用`showLoading`来控制该接口请求时出现loading效果

```js
  const network  = new Network();
  network
    .get('/query',{size:20})
    //指示该接口显示loading效果
    .showLoading()
    .then((data)=>{
     })
```

###### 关于重试机制

在部分业务场景下，我们希望指定接口在调用失败情况下能，进行重试，

默认的重试条件为:`在接口发生网络错误时，或者wx.request失败时`会进行重试

执行重试可以通过`try`函数进行重试配置 例如:`network.get(/query').try(10)`

还可以指定额外的重试条件， 例如: `network.get('/query').try(10,(resp)=>resp.data==null)`

具体参照如下:

```js
  const network  = new Network();

  //默认重试
  network
    .get('/query',{size:20})
    //配置重试机制 指定重试次数为2次
    .try(2)
    .then((data)=>{
     })

  //追加自定义重试条件
  network
    .get('/query',{size:20})
    //配置重试机制 指定重试次数为2次,出现条件为 在返回的结果的状态code！==200
    .try(2,(resp)=>resp.data.stat.code!==200)
    .then((data)=>{
     })

```

###### 关于合并请求

有时候我们希望同时发出几个请求，但是希望在这几个请求全部请求完毕后，再执行回调

然后在回调中能获取到每个请求的结果，通过以下方式我们可以合并请求(不是串联方式发送，而是同时发出)

具体参照如下:

```js
  const network  = new Network();

  network
    .get('/getinfo',{size:20})
    //通过merge链式函数，合并network.post('/getorders')请求
    .merge(network.post('/getorders'),'orders')
    .then((data)=>{
        //这里可以获取合并的结果，
        const info = data.original;//original为第一个请求的结果
        //获取第二个请求结果
        const orders = data.orders;
     })

```

###### 关于接口返回结果扩展

通过`network`发起接口请求，会返回一个`AttachResponse`实例，该实例支持promise机制，且能扩展结果处理链

例如，如果希望结果返回json格式时我们通常是如下方式处理

```js
  network.get('/query').then((response)=>response.json()).then((json)=>{...})
```

为了简化,我们可以在`AttachResponse`定义一个 `json`函数来代替上边`then((response)=>response.json())`

那么就可以如下方式调用

```js
  network.get('query').json().then((json)=>{...})
```

如果需要定义其他针对返回结果格式化可以去修改`AttachResponse`

(推荐：仅在该函数比较通用才加入，否则`AttachResponse`会越来越重)

`AttachResponse`定义在network/index.js中

###### 支持哪些事件

- `start`  开始发送请求前 可以在此阶段修改传入的数据以及请求头 例如   `Network.on('start',(data,headers)=>{ ....  })`

- `end` 请求完毕不管是成功还是失败  `Network.on('end',(errorOrResponse)=>{ ....  })`

- `response` 请求成功，此时可以获取到response对象 `Network.on('response',(response)=>{ ....  })`

- `error` 接口请求出错，以及promise.then中出现了错误都会触发次事件 `Network.on('error',(error)=>{ ....  })`