'use strict';

/**
 * @namespace Map
 */

/**
 * Описание автора объявления
 * @typedef {Object} Author
 * @property {string} avatar - Путь к файлу аватарки
 */

/**
 * Детали объявления
 * @typedef {Object} Offer
 * @property {string} title - Заголовок
 * @property {string} address - Адрес жилья
 * @property {number} price - Цена за ночь
 * @property {string} type - Тип жилья
 * @property {number} rooms - Количество комнат
 * @property {number} guests - Количество размещаемых гостей
 * @property {string} checkin - Время заселения
 * @property {string} checkout - Время выселения
 * @property {Array.<string>} features - Удобства в жилье
 * @property {string} description - Описание жилья
 * @property {Array.<string>} photos - Пути к фотографиям жилья
 */

/**
 * Местоположение объекта
 * @typedef {Object} Location
 * @property {number} x - Координата x
 * @property {number} y - Координата y
 */

/**
 * Объявление
 * @typedef {Object} Ad
 * @property {Author} author
 * @property {Offer} offer
 * @property {Location} location
 */

(function () {
  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');
  var mainPin = map.querySelector('.map__pin--main');
  var pinsContainer = map.querySelector('.map__pins');
  var mapErrorElement = document.querySelector('.error');

  /**
   * @const {number}
   */
  var MAX_NUM_OF_PINS = 5;

  /**
   * Параметры главного маркера выбора адреса на карте
   * @type {Object}
   * @property {number} WIDTH
   * @property {number} HEIGHT
   * @property {number} DEFAULT_OFFSET_LEFT
   * @property {number} DEFAULT_OFFSET_TOP
   */
  var mainPinParams = {
    WIDTH: 65,
    HEIGHT: 79,
    DEFAULT_OFFSET_LEFT: 570,
    DEFAULT_OFFSET_TOP: 375
  };

  /**
   * Границы изменения координаты маркера
   * @type {Object}
   * @property {number} TOP
   * @property {number} BOTTOM
   * @property {number} LEFT
   * @property {number} RIGHT
   */
  var mapBorders = {
    TOP: 130,
    BOTTOM: 630,
    LEFT: 0,
    RIGHT: 1200
  };

  /**
   * Содержит пины, открытые на карте
   * @type {Array.<Node>}
   */
  var pinsOnMap = [];

  /**
   * Удаляет все указатели с карты, кроме главного
   */
  var clearMap = function () {
    pinsOnMap.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
    pinsOnMap = [];
  };

  var resetMapToInitialState = function () {
    clearMap();

    // Ставим приветственное сообщение
    map.classList.add('map--faded');

    // Восстанавливаем состояние главного маркера
    mainPin.style.left = mainPinParams.DEFAULT_OFFSET_LEFT + 'px';
    mainPin.style.top = mainPinParams.DEFAULT_OFFSET_TOP + 'px';
    mainPin.addEventListener('mousedown', mainPinInitialClickHandler);

    // Очищаем список объявлений
    window.map.similarAds = [];
  };

  /**
   * @param {Array.<Ad>} ads - Массив объявлений
   */
  var successDownloadHandler = function (ads) {
    map.classList.remove('map--faded');
    pinsContainer.appendChild(createPinsFragment(ads));

    window.form.activate();
    window.filter.activate(ads.slice());
    mainPin.removeEventListener('mousedown', mainPinInitialClickHandler);
  };

  /**
   * Обновляет содержимое карты на переданный массив объявлений
   * @param {Array.<Ad>} ads
   */
  var updateMap = function (ads) {
    clearMap();
    pinsContainer.appendChild(createPinsFragment(ads));
  };

  /**
   * @param {string} messageText
   */
  var errorDownloadHandler = function (messageText) {
    var errorText = 'Не удалось загрузить данные. ' + messageText;
    window.message.show(mapErrorElement, errorText);
  };

  var mainPinInitialClickHandler = function () {
    window.backend.download(successDownloadHandler, errorDownloadHandler);
  };

  /**
   * Возвращает адрес, на который указывает главный маркер
   * Если переданы параметры dx и dy, то возвращает адрес со смещением
   * @param {number} dx
   * @param {number} dy
   * @return {Location}
   */
  var getMainPinAddress = function (dx, dy) {
    dx = dx ? dx : 0;
    dy = dy ? dy : 0;

    return {
      x: mainPin.offsetLeft + dx + Math.floor(mainPinParams.WIDTH / 2),
      y: mainPin.offsetTop + dy + mainPinParams.HEIGHT
    };
  };

  /**
   * @param {Array.<Ad>} ads - Массив объявлений
   * @return {DocumentFragment} - Фрагмент с маркерами на карте
   */
  var createPinsFragment = function (ads) {
    var fragment = document.createDocumentFragment();
    var numOfPins = 0;

    if (ads.length) {
      numOfPins = ads.length < MAX_NUM_OF_PINS ? ads.length : MAX_NUM_OF_PINS;
    }

    for (var i = 0; i < numOfPins; i++) {
      var pin = window.pin.create(ads[i]);

      pinsOnMap.push(pin);
      fragment.appendChild(pin);
    }

    return fragment;
  };

  /**
   * Вставляет карточку с информацией в разметку
   * @param {Node} card
   */
  var insertCard = function (card) {
    map.insertBefore(card, filtersContainer);
  };

  // Добавляем обработчики событий на главный маркер
  mainPin.addEventListener('mousedown', mainPinInitialClickHandler);
  mainPin.addEventListener('mousedown', function (evt) {

    var cursorCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mapMouseMoveHandler = function (moveEvt) {
      // Получаем данные о смещении координат
      var shift = {
        x: moveEvt.clientX - cursorCoords.x,
        y: moveEvt.clientY - cursorCoords.y
      };

      // Обновляем данные о положении курсора
      cursorCoords.x = moveEvt.clientX;
      cursorCoords.y = moveEvt.clientY;

      // Получаем данные о том, куда будет указывать маркер после перемещения
      var newCoords = getMainPinAddress(shift.x, shift.y);

      // Перемещаем, если новый адрес попадает в заданные рамки
      if (newCoords.y <= mapBorders.BOTTOM && newCoords.y >= mapBorders.TOP) {
        mainPin.style.top = (mainPin.offsetTop + shift.y) + 'px';
      }
      if (newCoords.x <= mapBorders.RIGHT && newCoords.x >= mapBorders.LEFT) {
        mainPin.style.left = (mainPin.offsetLeft + shift.x) + 'px';
      }

      // Обновляем поле с адресом
      window.form.setAddressValue(getMainPinAddress());
    };

    var documentMouseUpHandler = function () {
      window.form.setAddressValue(getMainPinAddress());

      document.removeEventListener('mousemove', mapMouseMoveHandler);
      document.removeEventListener('mouseup', documentMouseUpHandler);
    };

    document.addEventListener('mousemove', mapMouseMoveHandler);
    document.addEventListener('mouseup', documentMouseUpHandler);
  });

  window.form.setAddressValue(getMainPinAddress());

  window.map = {
    insertCard: insertCard,
    getAddress: getMainPinAddress,
    reset: resetMapToInitialState,
    update: updateMap
  };
})();
