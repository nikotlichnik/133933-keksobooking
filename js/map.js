'use strict';

/**
 * @namespace Map
 */

(function () {
  /**
   * Число генерируемых объявлений
   * @type {number}
   */
  var NUM_OF_ADS = 8;

  var map = document.querySelector('.map');
  var filtersContainer = map.querySelector('.map__filters-container');
  var mainPin = map.querySelector('.map__pin--main');
  var pinsContainer = map.querySelector('.map__pins');

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

  var activateMap = function (ads) {
    map.classList.remove('map--faded');

    pinsContainer.appendChild(createPinsFragment(ads));
  };

  var resetMapToInitialState = function () {
    // Удаляем все указатели с карты, кроме главного
    pinsOnMap.forEach(function (item) {
      item.parentNode.removeChild(item);
    });
    pinsOnMap = [];

    // Ставим приветственное сообщение
    map.classList.add('map--faded');

    // Восстанавливаем состояние главного маркера
    mainPin.style.left = mainPinParams.DEFAULT_OFFSET_LEFT + 'px';
    mainPin.style.top = mainPinParams.DEFAULT_OFFSET_TOP + 'px';
    mainPin.addEventListener('mousedown', mainPinInitialClickHandler);
  };

  var mainPinInitialClickHandler = function () {
    window.backend.download(activateMap);
    window.form.activate();

    mainPin.removeEventListener('mousedown', mainPinInitialClickHandler);
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

    ads.forEach(function (item) {
      var pin = window.pin.create(item);

      pinsOnMap.push(pin);
      fragment.appendChild(pin);
    });

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
    reset: resetMapToInitialState
  };
})();
