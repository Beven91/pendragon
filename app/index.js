import "./components/error";
import React from 'react'
import ReactDOM from 'react-dom';
import App from './containers/app';
import { Toast } from 'antd-mobile'
import { Validator } from 'dantejs'
import config from '../config';
import Network from './components/network';

const SHORT = 2;

// 全局接口数据配置
Network.config({
  baseUri: config.baseUri,
  data: {},
  loading: Toast.loading.bind(Toast),
  defaultContentType: 'application/json'
})
// 全局接口异常提示
Network.on('error', (error) => Toast.fail('哎呀，网络请求异常啦，请稍候再试试...', SHORT))
// 全局验证失败提示
Validator.validator.onInvalid((message) => Toast.show(message, SHORT))

ReactDOM.render(<App />, document.getElementById('app'));