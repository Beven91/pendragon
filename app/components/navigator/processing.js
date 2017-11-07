export default class Processing {

  static show() {
    this.timer = setTimeout(() => this.preloader(), 200)
  }

  static preloader() {
    let container = this.container = document.createElement('div');
    container.innerHTML = `
      <div class="preloader-indicator-overlay"></div>
      <div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>
     `;
    document.body.appendChild(container);
  }

  static hide() {
    clearTimeout(this.timer);
    if (this.container) {
      this.container.parentElement.removeChild(this.container);
    }
  }
}