import Preload from '../preload';

export default class Processing {

  static show() {
    Preload.showLoading();
  }

  static hide() {
    Preload.closeLoading();
  }
}