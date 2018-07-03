'use strict';

/**
 * @namespace Message
 */

(function () {
  var activeMessageElement;

  var removeMessageHandlers = function () {
    activeMessageElement.removeEventListener('click', messageClickHandler);
    document.removeEventListener('keydown', messageEscPressHandler);
    activeMessageElement = null;
  };

  var messageClickHandler = function () {
    hideMessage();
    removeMessageHandlers();
  };

  var messageEscPressHandler = function (evt) {
    window.utils.isEscEvent(evt, hideMessage);
    removeMessageHandlers();
  };

  var hideMessage = function () {
    activeMessageElement.classList.add('hidden');
  };

  /**
   * Показывает информационное сообщение
   * @param {HTMLElement} messageElement
   * @param {string} messageText
   */
  var showMessage = function (messageElement, messageText) {
    activeMessageElement = messageElement;

    if (messageText) {
      var textContainer = activeMessageElement.querySelector('p');
      textContainer.textContent = messageText;
    }

    activeMessageElement.classList.remove('hidden');

    activeMessageElement.addEventListener('click', messageClickHandler);
    document.addEventListener('keydown', messageEscPressHandler);
  };

  window.message = {
    show: showMessage
  };
})();

