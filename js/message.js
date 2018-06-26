'use strict';

/**
 * @namespace Message
 */

(function () {
  var activeMessage;

  var removeMessageHandlers = function () {
    activeMessage.removeEventListener('click', messageClickHandler);
    document.removeEventListener('keydown', messageEscPressHandler);
    activeMessage = null;
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
    activeMessage.classList.add('hidden');
  };

  /**
   * @param {HTMLElement} messageElement
   * @param {string} messageText
   */
  var showMessage = function (messageElement, messageText) {
    activeMessage = messageElement;

    if (messageText) {
      var textContainer = activeMessage.querySelector('p');
      textContainer.textContent = messageText;
    }

    activeMessage.classList.remove('hidden');

    activeMessage.addEventListener('click', messageClickHandler);
    document.addEventListener('keydown', messageEscPressHandler);
  };

  window.message = {
    show: showMessage
  };
})();

