'use strict';

/**
 * Число генерируемых объявлений
 * @type {number}
 */
var NUM_OF_ADS = 8;

/**
 * @constant {number}
 */
var ESC_KEYCODE = 27;

/**
 * Объект, описывающий автора объявления
 * @typedef {Object} Author
 * @property {string} avatar - Путь к файлу аватарки
 */

/**
 * Объект, описывающий детали объявления
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
 * Объект, описывающий местоположение объекта
 * @typedef {Object} Location
 * @property {number} x - Координата x
 * @property {number} y - Координата y
 */

/**
 * Объект, описывающий объявление
 * @typedef {Object} Ad
 * @property {Author} author
 * @property {Offer} offer
 * @property {Location} location
 */

/**
 * Объект, описывающий промежуток значений
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
 * Параметры маркера на карте
 * @typedef {Object} PinParams
 * @property {number} WIDTH
 * @property {number} HEIGHT
 */
var pinParams = {
  WIDTH: 50,
  HEIGHT: 70
};

/**
 * Параметры маркера выбора адреса на карте
 * @type {Object} AddressPointerParams
 * @property {number} WIDTH
 * @property {number} HEIGHT
 * @property {number} DEFAULT_X
 * @property {number} DEFAULT_Y
 */
var addressPointerParams = {
  WIDTH: 40,
  HEIGHT: 44,
  DEFAULT_X: 570,
  DEFAULT_Y: 375
};

/**
 * Параметры фотографии жилья
 * @typedef {Object} PhotoParams
 * @property {number} WIDTH
 * @property {number} HEIGHT
 * @property {string} ALT
 * @property {string} CLASS_NAME
 */
var photoParams = {
  WIDTH: 45,
  HEIGHT: 40,
  ALT: 'Фотография жилья',
  CLASS_NAME: 'popup__photo'
};

/**
 * Русские названия английских типов жилья
 * @enum {string}
 */
var offerTypesTranslation = {
  flat: 'Квартира',
  palace: 'Дворец',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var map = document.querySelector('.map');
var addressPointer = map.querySelector('.map__pin--main');
var pinsContainer = document.querySelector('.map__pins');
var filtersContainer = document.querySelector('.map__filters-container');
var adForm = document.querySelector('.ad-form');
var addressField = adForm.querySelector('#address');
var adFieldsets = adForm.querySelectorAll('.ad-form__element');

var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');

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
 * @return {Array.<string>} - Случайный набор удобств
 */
var getAdFeatures = function () {
  var shuffledFeatures = getShuffledArray(offerParams.FEATURES);
  var randomIndex = getRandomIndexOfArray(shuffledFeatures);

  return shuffledFeatures.slice(0, randomIndex);
};

/**
 * @param {number} adIndex - Индекс генерируемого объявления
 * @return {Ad}
 */
var generateSimilarAd = function (adIndex) {
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

/**
 * @return {Array.<Ad>} - Массив с объектами, описывающими объявления
 */
var generateSimilarAds = function () {
  var randomAds = [];

  for (var i = 0; i < NUM_OF_ADS; i++) {
    randomAds.push(generateSimilarAd(i));
  }

  return randomAds;
};

/**
 * @param {Ad} ad - Объявление
 * @return {Node} - Маркер для карты
 */
var createPinElement = function (ad) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImage = pinElement.querySelector('img');

  pinElement.addEventListener('click', function () {
    openCard(ad);
  });

  pinElement.style.left = (ad.location.x - pinParams.WIDTH / 2) + 'px';
  pinElement.style.top = (ad.location.y - pinParams.HEIGHT) + 'px';
  pinImage.src = ad.author.avatar;
  pinImage.alt = ad.offer.title;

  return pinElement;
};

/**
 * @param {Array.<Ad>} ads - Массив объявлений
 * @return {DocumentFragment} - Фрагмент с маркерами на карте
 */
var createPinsFragment = function (ads) {
  var fragment = document.createDocumentFragment();

  ads.forEach(function (item) {
    fragment.appendChild(createPinElement(item));
  });

  return fragment;
};

/**
 * @param {string} feature - Удобство
 * @return {HTMLLIElement} - Элемент списка удобств
 */
var createFeatureItem = function (feature) {
  var featureItem = document.createElement('li');

  featureItem.classList.add('popup__feature', 'popup__feature--' + feature);

  return featureItem;
};

/**
 * @param {string} photo - Путь к фотографии
 * @return {Node} - Элемент c фотографией
 */
var createPhotoElement = function (photo) {
  var photoElement = document.createElement('img');

  photoElement.classList.add(photoParams.CLASS_NAME);
  photoElement.style.width = photoParams.WIDTH + 'px';
  photoElement.style.height = photoParams.HEIGHT + 'px';
  photoElement.alt = photoParams.ALT;
  photoElement.src = photo;

  return photoElement;
};

/**
 * @param {Ad} ad - Объявление
 * @return {Node} - Элемент карточки с объявлением
 */
var generateInfoCard = function (ad) {
  var card = cardTemplate.cloneNode(true);
  var featuresList = card.querySelector('.popup__features');
  var photosList = card.querySelector('.popup__photos');
  var adDescriptionBlock = card.querySelector('.popup__description');
  var closeCardButton = card.querySelector('.popup__close');

  var houseType = ad.offer.type;
  var rooms = ad.offer.rooms;
  var guests = ad.offer.guests;
  var checkin = ad.offer.checkin;
  var checkout = ad.offer.checkout;
  var features = ad.offer.features;
  var photos = ad.offer.photos;
  var description = ad.offer.description;

  card.querySelector('.popup__avatar').src = ad.author.avatar;
  card.querySelector('.popup__title').textContent = ad.offer.title;
  card.querySelector('.popup__text--address').textContent = ad.offer.address;
  card.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = offerTypesTranslation[houseType];
  card.querySelector('.popup__text--capacity').textContent = rooms + ' комнаты для ' + guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + checkin + ', выезд до ' + checkout;

  if (description) {
    adDescriptionBlock.textContent = description;
  } else {
    card.removeChild(adDescriptionBlock);
  }

  if (features.length !== 0) {
    features.forEach(function (feature) {
      featuresList.appendChild(createFeatureItem(feature));
    });
  } else {
    card.removeChild(featuresList);
  }

  if (photos.length !== 0) {
    photos.forEach(function (photo) {
      photosList.appendChild(createPhotoElement(photo));
    });
  } else {
    card.removeChild(photosList);
  }

  closeCardButton.addEventListener('click', function () {
    closeCard();
  });

  return card;
};

/**
 * @param {HTMLElement} pointer
 */
var setAddressValue = function (pointer) {
  var pointerX = pointer.style.left ? parseInt(pointer.style.left, 10) : addressPointerParams.DEFAULT_X;
  var pointerY = pointer.style.top ? parseInt(pointer.style.top, 10) : addressPointerParams.DEFAULT_Y;
  var x = pointerX + addressPointerParams.WIDTH / 2;
  var y = pointerY + addressPointerParams.HEIGHT;

  addressField.value = x + ', ' + y;
};

var EscapeKeyPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeCard();
  }
};

/**
 * @param {Ad} ad - Объявление
 */
var openCard = function (ad) {
  map.insertBefore(generateInfoCard(ad), filtersContainer);
  document.addEventListener('keydown', EscapeKeyPressHandler);
};

var closeCard = function () {
  var openedCard = map.querySelector('.map__card');

  openedCard.parentNode.removeChild(openedCard);
  document.removeEventListener('keydown', EscapeKeyPressHandler);
};

var activatePage = function () {
  var ads = generateSimilarAds();

  // Убираем приветственное сообщение
  map.classList.remove('map--faded');

  // Активируем элементы формы заполнения информации об объявлении
  adForm.classList.remove('ad-form--disabled');
  adFieldsets.forEach(function (item) {
    item.disabled = false;
  });

  // Добавляем маркеры в контейнер
  pinsContainer.appendChild(createPinsFragment(ads));
};

var addressPointerFirstClickHandler = function () {
  activatePage();

  addressPointer.removeEventListener('mouseup', addressPointerFirstClickHandler);
};

/**
 * Инициализирует страницу
 */
var initPage = function () {
  // Блокируем поля форм
  adFieldsets.forEach(function (item) {
    item.disabled = true;
  });

  // Следим за тем, чтобы на карте не было двух открытых карточек с информацией
  map.addEventListener('click', function () {
    var openedCard = map.querySelectorAll('.map__card');

    if (openedCard.length === 2) {
      map.removeChild(openedCard[0]);
    }
  });

  addressPointer.addEventListener('mouseup', addressPointerFirstClickHandler);

  setAddressValue(addressPointer);
};

initPage();
