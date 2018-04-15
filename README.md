# pendragon

## 一、简介

`React SPA` 开发案例

使用`webpack`搭建的脚手架

###### 支持哪些特性?

- 支持`es6` 与 `es7` 等语法
- 支持图片压缩
- 支持热更新
- 支持响应式布局&样式兼容[`autoprefix`](https://github.com/postcss/autoprefixer) 布局默认按照`375`宽度来布局
- 支持代码按需加载
- 支持路由`代码拆分`
- 支持`微信`接入
- 支持`数据打点`
- 支持`前端异常上报`
- 集成[`redux`](https://github.com/reactjs/redux)
- 集成[`ant-design-mobile`](https://github.com/ant-design/ant-design-mobile/)组件库
- 项目采用`mono-repo`管理方式，使用的工具是[`lerna`](https://github.com/lerna/lerna)

&#8195;

## 二、开发调试

- `npm install`
- `npm start`

&#8195;

## 三、本地CLI

- 新建一个页面

&#8195;  `npm run new <name>`

## 四、关于特性

#### 响应式布局

采用`REM`单位做响应式布局，`font-size`生成方案使用[`flexblejs`](https://github.com/amfe/lib-flexible/)

布局基础值为`37.5` 也就是统一使用`iPhone6`的尺寸进行调试

在所有的`css`文件中均使用`px`为单位，因为会统一使用`pxtorem`进行响应式单位打包输出，

另外书写`css`兼容时，无需添加前缀，例如`-webkit` 因为会统一使用[`autoprefix`](https://github.com/postcss/autoprefixer)进行兼容打包输出

#### 代码拆分

默认代码拆分按照`app/modules/`目录下的`xxx/views/index`进行代码拆分 也就是按照`页面`进行拆分

如果需要变更方案，可以自行修改根目录下`.package.js`中的splitRoutes,可以改为静态维护，例如维护成一个数组

```js
  //代碼拆分配置
  splitRoutes: [
    'app/modules/user/views/index',
    'app/modules/user/views/home',
    'app/modules/order/views/index'
  ],
```

#### 数据打点

数据打点由组件[`venylog`](/packages/components/venylog)进行配置，具体可以参见内部打点实现

#### 异常上报

异常捕获由组件[`error`](/packages/components/error)实现，在开发模式下，如果出现脚本异常会弹出一个浮层，

在生产模式，可以自行配置上报后台具体查看`error`组件实现

#### 关于Redux

本项目的[`redux`](https://github.com/reactjs/redux)集成，采用[`hanzojs`](https://github.com/pamler/hanzojs)的`redux`集成方案

#### 关于导航组件

项目采用[`React-Navigation`](https://github.com/react-navigation/react-navigation)作为路由组件，

上层定制的导航组件为[`navigator`](/packages/components/navigator) 用于实现切换动画效果

以及异步组件加载支持(代码拆分的页面组件) 采用`SPA`路由为`pushState`

## 五、关于框架

- [`framework`](/packages/framework)
- [`services`](/packages/services)
- [`components`](/packages/components)
- [`modules`](/app/modules)

&#8195;

## 六、发布构建

&#8195;  `npm run build`
