/**
 * services模块入口js
 * 由于components模块使用了babel-plugin-import(按需打包)
 * 请确保export公布的模块名称，与模块的文件名保持一致，
 * 例如: 
 *   import Network from './network'  
 *   Network与 './network'的文件名一致不区分大小写
 * 
 * 如果命名带有驼峰，请讲文件名按照 '-' 分割开
 * 例如:
 *  import NetworkAny from './network-any'  
 *  NetworkAny 按照驼峰拆分使用'-'隔开，所以文件名应该命名为 'network-any'
 */
import UserService from './UserService';
import WechatService from './WechatService';

export {
  UserService,
  WechatService
}