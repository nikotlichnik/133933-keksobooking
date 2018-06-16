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
 * @type {Object}
 * @property {number} WIDTH
 * @property {number} HEIGHT
 */
var pinParams = {
  WIDTH: 50,
  HEIGHT: 70
};

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

/**
 * Минимальные цены разных типов жилья
 * @enum {number}
 */
var minPriceConstraints = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

/**
 * Ограничение на связь количества гостей и комнат
 * @type {Object}
 * @enum {Range} - Ограничение на число гостей
 */
var capacityConstraint = {
  '1': {
    MIN: 1,
    MAX: 1
  },
  '2': {
    MIN: 1,
    MAX: 2
  },
  '3': {
    MIN: 1,
    MAX: 3
  },
  '100': {
    MIN: 0,
    MAX: 0
  }
};

var NO_GUEST_MESSAGE = 'Ваше жильё должно быть не для гостей';

var map = document.querySelector('.map');
var mainPin = map.querySelector('.map__pin--main');
var pinsContainer = document.querySelector('.map__pins');
var filtersContainer = document.querySelector('.map__filters-container');

var adForm = document.querySelector('.ad-form');
var inputElements = adForm.querySelectorAll('input, select, textarea');
var addressField = adForm.querySelector('#address');
var titleInput = adForm.querySelector('#title');
var typeInput = adForm.querySelector('#type');
var priceInput = adForm.querySelector('#price');
var checkinInput = adForm.querySelector('#timein');
var checkoutInput = adForm.querySelector('#timeout');
var roomNumberInput = adForm.querySelector('#room_number');
var capacityInput = adForm.querySelector('#capacity');
var submitButton = adForm.querySelector('.ad-form__submit');
var resetButton = adForm.querySelector('.ad-form__reset');
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
 * Проверяет, находится ли число в диапазоне
 * @param {number} number - число
 * @param {Range} range
 * @return {Boolean}
 */
var isInRange = function (number, range) {
  return (number >= range.MIN) && (number <= range.MAX);
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
    setActivePin(pinElement);
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
    closeActiveCard();
  });

  return card;
};

/**
 * @param {HTMLElement} pointer
 * @return {Location}
 */
var getCoordinates = function (pointer) {
  return {
    x: pointer.offsetLeft + Math.floor(mainPinParams.WIDTH / 2),
    y: pointer.offsetTop + mainPinParams.HEIGHT
  };
};

/**
 * @param {Location} coordinates
 */
var setAddressValue = function (coordinates) {
  addressField.value = coordinates.x + ', ' + coordinates.y;
};

/**
 * Закрывает открытую карточку, если такая есть, и открывает новую
 * @param {Ad} ad - Объявление
 */
var openCard = function (ad) {
  if (activeCard) {
    closeActiveCard();
  }
  activeCard = generateInfoCard(ad);

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

var mainPinClickHandler = function () {
  activatePage();

  mainPin.removeEventListener('mouseup', mainPinClickHandler);
};

var resetClickHandler = function () {
  resetPage();
};

var capacityChangeHandler = function () {
  checkCapacityConstraint();
};

var timeChangeHandler = function (evt) {
  var time = evt.target.value;
  checkinInput.value = time;
  checkoutInput.value = time;
};

var typeChangeHandler = function () {
  refreshPricePlaceholder();
  checkPriceConstraint();
};

var priceInputHandler = function () {
  checkPriceConstraint();
};

var submitClickHandler = function () {
  highlightInvalidInputs();
};

var titleInputHandler = function () {
  if (titleInput.checkValidity()) {
    removeOutline(titleInput);
  }
};

var highlightInvalidInputs = function () {
  inputElements.forEach(function (input) {
    // Если поле невалидно - ставим красную рамку
    if (!input.checkValidity()) {
      addRedOutline(input);
    }
  });
};

var addRedOutline = function (element) {
  element.style.outline = '2px solid red';
};

var removeOutline = function (element) {
  element.style.outline = '';
};

var refreshPricePlaceholder = function () {
  var type = typeInput.value;
  priceInput.placeholder = minPriceConstraints[type];
};

var checkPriceConstraint = function () {
  var type = typeInput.value;
  var price = priceInput.value;
  var minPrice = minPriceConstraints[type];

  if (price < minPrice) {
    priceInput.setCustomValidity('Минимальная цена для типа "' + offerTypesTranslation[type] + '" ' + minPrice + '₽');
  } else {
    priceInput.setCustomValidity('');
    removeOutline(priceInput);
  }
};

var checkCapacityConstraint = function () {
  var numOfRooms = roomNumberInput.value;
  var capacity = capacityInput.value;
  var capacityRange = capacityConstraint[numOfRooms];

  var minGuest = capacityRange.MIN;
  var maxGuest = capacityRange.MAX;
  var normalMessage = 'Для выбранного количества комнат минимум гостей - ' + minGuest + ', максимум - ' + maxGuest;

  var message = (capacityRange.MAX === 0) ? NO_GUEST_MESSAGE : normalMessage;

  if (!isInRange(capacity, capacityRange)) {
    capacityInput.setCustomValidity(message);
  } else {
    capacityInput.setCustomValidity('');
    removeOutline(capacityInput);
  }
};

var resetMap = function () {
  // Закрываем открытую карточку
  if (activeCard) {
    closeActiveCard();
  }

  // Удаляем все указатели с карты, кроме главного
  var pins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
  pins.forEach(function (item) {
    item.parentNode.removeChild(item);
  });

  // Ставим приветственное сообщение
  map.classList.add('map--faded');

  // Восстанавливаем состояние главного маркера
  mainPin.style.left = mainPinParams.DEFAULT_OFFSET_LEFT + 'px';
  mainPin.style.top = mainPinParams.DEFAULT_OFFSET_TOP + 'px';
};

var resetForm = function () {
  adForm.reset();

  adForm.classList.add('ad-form--disabled');
  adFieldsets.forEach(function (item) {
    item.disabled = true;
  });

  refreshPricePlaceholder();
  priceInput.setCustomValidity('');
  capacityInput.setCustomValidity('');

  setAddressValue(getCoordinates(mainPin));

  // Удаляем обработчики ограничений форм
  priceInput.removeEventListener('input', priceInputHandler);
  typeInput.removeEventListener('change', typeChangeHandler);
  titleInput.removeEventListener('input', titleInputHandler);
  checkinInput.removeEventListener('change', timeChangeHandler);
  checkoutInput.removeEventListener('change', timeChangeHandler);
  capacityInput.removeEventListener('change', capacityChangeHandler);
  roomNumberInput.removeEventListener('change', capacityChangeHandler);


  submitButton.removeEventListener('click', submitClickHandler);
  resetButton.removeEventListener('click', resetClickHandler);
};

var resetPage = function () {
  resetMap();
  resetForm();

  mainPin.addEventListener('mouseup', mainPinClickHandler);
};

var activateForm = function () {
  adForm.classList.remove('ad-form--disabled');
  adFieldsets.forEach(function (item) {
    item.disabled = false;
  });

  submitButton.addEventListener('click', submitClickHandler);

  titleInput.addEventListener('input', titleInputHandler);
  priceInput.addEventListener('input', priceInputHandler);
  typeInput.addEventListener('change', typeChangeHandler);
  checkinInput.addEventListener('change', timeChangeHandler);
  checkoutInput.addEventListener('change', timeChangeHandler);
  capacityInput.addEventListener('change', capacityChangeHandler);
  roomNumberInput.addEventListener('change', capacityChangeHandler);

  resetButton.addEventListener('click', resetClickHandler);
};

var activateMap = function () {
  var ads = generateSimilarAds();

  map.classList.remove('map--faded');

  pinsContainer.appendChild(createPinsFragment(ads));
};

var activatePage = function () {
  activateMap();
  activateForm();
};

var initPage = function () {
  // Блокируем поля форм
  adFieldsets.forEach(function (item) {
    item.disabled = true;
  });

  mainPin.addEventListener('mouseup', mainPinClickHandler);

  setAddressValue(getCoordinates(mainPin));
};

initPage();
