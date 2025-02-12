class HomeView {
  _parentElement = document.querySelector('.header__logo');

  addHandlerHome(handler) {
    this._parentElement.addEventListener('click', handler);
  }
}

export default new HomeView();
