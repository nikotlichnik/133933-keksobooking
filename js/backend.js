'use strict';

/**
 * @namespace Backend
 */

(function () {
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';

  /**
   * @param {XMLHttpRequest} xhr
   * @param {function} onLoad
   * @param {function} onError
   */
  var addLoadListener = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка ' + xhr.status);
      }
    });
  };

  /**
   * @param {XMLHttpRequest} xhr
   * @param {function} onError
   */
  var addErrorListener = function (xhr, onError) {
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
  };

  /**
   * @param {XMLHttpRequest} xhr
   * @param {function} onError
   */
  var addTimeoutListener = function (xhr, onError) {
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });
  };

  /**
   * Загружает с сервера данные в формате JSON
   * @param {function} onLoad
   * @param {function} onError
   */
  var download = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    addLoadListener(xhr, onLoad, onError);
    addErrorListener(xhr, onError);
    addTimeoutListener(xhr, onError);

    xhr.open('GET', DOWNLOAD_URL);
    xhr.send();
  };

  /**
   * Отправляет на сервер данные формы
   * @param {FormData} data
   * @param {function} onLoad
   * @param {function} onError
   */
  var upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    addLoadListener(xhr, onLoad, onError);
    addErrorListener(xhr, onError);
    addTimeoutListener(xhr, onError);

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  window.backend = {
    download: download,
    upload: upload
  };
})();
