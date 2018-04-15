import Preload from '../preload';

export default class Processing {

  static show() {
    Preload.showLoading('',true,false)
  }

  static hide() {
    Preload.closeLoading();
  }
}