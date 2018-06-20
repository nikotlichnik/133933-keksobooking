'use strict';

/**
 * @namespace Map
 */

(function () {
  /**
   * @constant {number}
   */
  var ESC_KEYCODE = 27;

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var filtersContainer = map.querySelector('.map__filters-container');
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
   * Содержит ссылку на открытую карточку с информацией
   * @type {Node}
   */
  var activeCard;

  /**
   * Содержит ссылку на пин, карточка которого открыта
   * @type {Node}
   */
  var activePin;

  /**
   * Содержит пины, открытые на карте
   * @type {Array.<Node>}
   */
  var pinsOnMap = [];

  var activateMap = function () {
    var ads = window.data.generateAds();

    map.classList.remove('map--faded');

    pinsContainer.appendChild(createPinsFragment(ads));
  };

  var resetMapToInitialState = function () {
    // Закрываем открытую карточку
    if (activeCard) {
      closeActiveCard();
    }

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

  /**
   * Закрывает открытую карточку, если такая есть, и открывает новую
   * @param {Ad} ad - Объявление
   */
  var openCard = function (ad) {
    if (activeCard) {
      closeActiveCard();
    }
    activeCard = window.card.generate(ad);

    map.insertBefore(activeCard, filtersContainer);
    document.addEventListener('keydown', escapeKeyPressHandler);
  };

  /**
   * Закрывает открытую карточку и сбрасывает ссылку на неё
   */
  var closeActiveCard = function () {
    activeCard.parentNode.removeChild(activeCard);
    activeCard = null;

    deactivatePin();

    document.removeEventListener('keydown', escapeKeyPressHandler);
  };

  /**
   * Добавляет класс пину, карточка которого открыта, и сохраняет ссылку на него
   * @param {Node} pin
   */
  var setActivePin = function (pin) {
    activePin = pin;
    activePin.classList.add('map__pin--active');
  };

  /**
   * Убирает класс у активного пина и сбрасывает ссылку на него
   */
  var deactivatePin = function () {
    activePin.classList.remove('map__pin--active');
    activePin = null;
  };

  var escapeKeyPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeActiveCard();
    }
  };

  var mainPinInitialClickHandler = function () {
    activateMap();
    window.form.activate();

    mainPin.removeEventListener('mousedown', mainPinInitialClickHandler);
  };

  /**
   * @param {HTMLElement} pointer
   * @return {Location}
   */
  var getAddress = function (pointer) {
    return {
      x: pointer.offsetLeft + Math.floor(mainPinParams.WIDTH / 2),
      y: pointer.offsetTop + mainPinParams.HEIGHT
    };
  };

  /**
   * @param {HTMLElement} pointer
   * @param {number} dx
   * @param {number} dy
   * @return {Location}
   */
  var getNewAddress = function (pointer, dx, dy) {
    return {
      x: pointer.offsetLeft + dx + Math.floor(mainPinParams.WIDTH / 2),
      y: pointer.offsetTop + dy + mainPinParams.HEIGHT
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
      var newCoords = getNewAddress(mainPin, shift.x, shift.y);

      // Перемещаем, если новый адрес попадает в заданные рамки
      if (newCoords.y <= mapBorders.BOTTOM && newCoords.y >= mapBorders.TOP) {
        mainPin.style.top = (mainPin.offsetTop + shift.y) + 'px';
      }
      if (newCoords.x <= mapBorders.RIGHT && newCoords.x >= mapBorders.LEFT) {
        mainPin.style.left = (mainPin.offsetLeft + shift.x) + 'px';
      }

      // Обновляем поле с адресом
      window.form.setAddressValue(getAddress(mainPin));
    };

    var documentMouseUpHandler = function () {
      window.form.setAddressValue(getAddress(mainPin));

      document.removeEventListener('mousemove', mapMouseMoveHandler);
      document.removeEventListener('mouseup', documentMouseUpHandler);
    };

    document.addEventListener('mousemove', mapMouseMoveHandler);
    document.addEventListener('mouseup', documentMouseUpHandler);
  });

  window.form.setAddressValue(getAddress(mainPin));

  window.map = {
    setActivePin: setActivePin,
    openCard: openCard,
    closeActiveCard: closeActiveCard,
    getAddress: getAddress,
    reset: resetMapToInitialState
  };
})();
