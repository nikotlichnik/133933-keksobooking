'use strict';

/**
 * @namespace Utils
 */

(function () {
  /**
   * @constant {number}
   */
  var ESC_KEYCODE = 27;

  /**
   * @constant {number} в миллисекундах
   */
  var DEBOUNCE_INTERVAL = 500;

  /**
   * Вызывает функцию коллбэк, если нажат Escape
   * @param {EventListenerOrEventListenerObject} evt
   * @param {function} cb
   */
  var isEscEvent = function (evt, cb) {
    if (evt.keyCode === ESC_KEYCODE) {
      cb();
    }
  };

  /**
   * Возвращает функцию, у которой будет свой таймер и она будет контролировать
   * свое выполнение самостоятельно
   * @param {function} cb
   * @return {function}
   */
  var debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.utils = {
    isEscEvent: isEscEvent,
    debounce: debounce
  };
})();
