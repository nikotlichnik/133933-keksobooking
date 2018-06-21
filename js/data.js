'use strict';

/**
 * @namespace Data
 */

(function () {
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

  /**
   * Промежуток значений
   * @typedef {Object} Range
   * @property {number} MIN
   * @property {number} MAX
   */

  /**
   * Параметры генерируемых деталей объявлений
   * @typedef {Object} OfferParams
   * @property {Array.<string>} TITLES
   * @property {Range} PRICE
   * @property {Array.<string>} TYPES
   * @property {Range} ROOMS
   * @property {Range} GUESTS
   * @property {Array.<string>} CHECKINS
   * @property {Array.<string>} CHECKOUTS
   * @property {Array.<string>} FEATURES
   * @property {Array.<string>} PHOTOS
   */
  var offerParams = {
    TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
      'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
    PRICE: {
      MIN: 1000,
      MAX: 1000000
    },
    TYPES: ['palace', 'flat', 'house', 'bungalo'],
    ROOMS: {
      MIN: 1,
      MAX: 5
    },
    GUESTS: {
      MIN: 1,
      MAX: 9
    },
    CHECKINS: ['12:00', '13:00', '14:00'],
    CHECKOUTS: ['12:00', '13:00', '14:00'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    PHOTOS: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
  };

  /**
   * Параметры генерируемых местоположений объектов
   * @typedef {Object} LocationParams
   * @property {Range} X
   * @property {Range} Y
   */
  var locationParams = {
    X: {
      MIN: 300,
      MAX: 900
    },
    Y: {
      MIN: 130,
      MAX: 630
    }
  };


  /**
   * Возвращает случайно перемешанную копию массива (тасование Фишера — Йетса)
   * @param {Array} array
   * @return {Array} - Перемешанная копия массива
   */
  var getShuffledArray = function (array) {
    var shuffledArray = array.slice(0);

    for (var i = array.length - 1; i > 0; i--) {
      var swapIndex = Math.round(Math.random() * i);
      var swap = shuffledArray[swapIndex];
      shuffledArray[swapIndex] = shuffledArray[i];
      shuffledArray[i] = swap;
    }

    return shuffledArray;
  };

  /**
   * @param {Array} array
   * @return {number} - Индекс случайного элемента из массива
   */
  var getRandomIndexOfArray = function (array) {
    return Math.floor(Math.random() * array.length);
  };

  /**
   * @param {number} startNumber - Нижняя граница диапазона
   * @param {number} finishNumber - Верхняя граница диапазона
   * @return {number} - Случайное число в заданном диапазоне, включая концы интервала
   */
  var getRandomNumberInRange = function (startNumber, finishNumber) {
    return startNumber + Math.round(Math.random() * (finishNumber - startNumber));
  };

  /**
   * @param {number} elementNumber - Номер изображения
   * @return {string} - Путь к изображению с указанным номером
   */
  var getPicturePath = function (elementNumber) {
    var pathNumber = elementNumber < 10 ? '0' + elementNumber : elementNumber;

    return 'img/avatars/user' + pathNumber + '.png';
  };

  /**
   * @return {Array.<string>} - Случайный набор удобств
   */
  var getAdFeatures = function () {
    var shuffledFeatures = getShuffledArray(offerParams.FEATURES);
    var randomIndex = getRandomIndexOfArray(shuffledFeatures);

    return shuffledFeatures.slice(0, randomIndex);
  };


  /**
   * @function generateAd
   * @memberOf Data
   * @param {number} adIndex - Индекс генерируемого объявления
   * @return {Ad} Объявление
   */
  window.generateAd = function (adIndex) {
    var x = getRandomNumberInRange(locationParams.X.MIN, locationParams.X.MAX);
    var y = getRandomNumberInRange(locationParams.Y.MIN, locationParams.Y.MAX);

    return {
      author: {
        avatar: getPicturePath(adIndex + 1)
      },
      offer: {
        title: offerParams.TITLES[adIndex],
        address: x + ', ' + y,
        price: getRandomNumberInRange(offerParams.PRICE.MIN, offerParams.PRICE.MAX),
        type: offerParams.TYPES[getRandomIndexOfArray(offerParams.TYPES)],
        rooms: getRandomNumberInRange(offerParams.ROOMS.MIN, offerParams.ROOMS.MAX),
        guests: getRandomNumberInRange(offerParams.GUESTS.MIN, offerParams.GUESTS.MAX),
        checkin: offerParams.CHECKINS[getRandomIndexOfArray(offerParams.CHECKINS)],
        checkout: offerParams.CHECKOUTS[getRandomIndexOfArray(offerParams.CHECKOUTS)],
        features: getAdFeatures(),
        description: '',
        photos: offerParams.PHOTOS
      },
      location: {
        x: x,
        y: y
      }
    };
  };

})();
