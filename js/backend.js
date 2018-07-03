'use strict';

/**
 * @namespace Backend
 */

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';

  /**
   * @param {XMLHttpRequest} xhr
   * @param {function} loadHandler
   * @param {function} errorHandler
   */
  var addLoadListener = function (xhr, loadHandler, errorHandler) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        loadHandler(xhr.response);
      } else {
        errorHandler('Ошибка ' + xhr.status);
      }
    });
  };

  /**
   * @param {XMLHttpRequest} xhr
   * @param {function} errorHandler
   */
  var addErrorListener = function (xhr, errorHandler) {
    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });
  };

  /**
   * @param {XMLHttpRequest} xhr
   * @param {function} errorHandler
   */
  var addTimeoutListener = function (xhr, errorHandler) {
    xhr.addEventListener('timeout', function () {
      errorHandler('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });
  };

  /**
   * Загружает с сервера данные в формате JSON
   * @param {function} loadHandler
   * @param {function} errorHandler
   */
  var download = function (loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    addLoadListener(xhr, loadHandler, errorHandler);
    addErrorListener(xhr, errorHandler);
    addTimeoutListener(xhr, errorHandler);

    xhr.open('GET', DOWNLOAD_URL);
    xhr.send();
  };

  /**
   * Отправляет на сервер данные формы
   * @param {FormData} data
   * @param {function} loadHandler
   * @param {function} errorHandler
   */
  var upload = function (data, loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();

    addLoadListener(xhr, loadHandler, errorHandler);
    addErrorListener(xhr, errorHandler);
    addTimeoutListener(xhr, errorHandler);

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  window.backend = {
    download: download,
    upload: upload
  };
})();
