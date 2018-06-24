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
   * Вызывает функцию коллбэк, если нажат Escape
   * @param {EventListenerOrEventListenerObject} evt
   * @param {function} cb
   */
  var isEscEvent = function (evt, cb) {
    if (evt.keyCode === ESC_KEYCODE) {
      cb();
    }
  };

  window.utils = {
    isEscEvent: isEscEvent
  };
})();
