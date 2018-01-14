const { history } = window

if (!history.hasOwnProperty('state')) {
  (function (push, rep) {
    // history.state is always initialised to null
    history.state = null;

    history.pushState = function (state) {
      push.apply(history, arguments);

      history.state = state;
    };
    history.replaceState = function (state) {
      rep.apply(history, arguments);

      history.state = state;
    };

    window.addEventListener('popstate', function (e) {
      history.state = e.state;
    }, true);

  })(history.pushState, history.replaceState);
}