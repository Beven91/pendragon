import Saber from "components/error/index";
import config from 'myconfig';
import React from 'react'
import ReactDOM from 'react-dom';
import App from './containers/app';
import { Toast } from 'antd-mobile';
import { Preload } from 'components';
import { Network, Validation } from 'framework';

const SHORT = 2;

// 全局接口数据配置
Network.config({
  base: config.baseUri,
  data: {},
  loading: Preload.showLoading.bind(Preload)
})
// 全局接口异常提示
Network.on('error', (error) => {
  Saber.onCat(error);
  Toast.fail('哎呀，网络请求异常啦，请稍候再试试...', SHORT)
})
// 全局验证失败提示
Validation.validator.onInvalid((message) => Toast.show(message, SHORT))

//启动React应用
ReactDOM.render(<App />, document.getElementById('app'));