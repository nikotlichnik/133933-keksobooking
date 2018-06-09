'use strict';

var NUM_OF_ADS = 8;
var INDEX_OF_FULL_DESCRIBED_AD = 0;

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

var locationParams = {
  X: {
    START: 300,
    END: 900
  },
  Y: {
    START: 130,
    END: 630
  }
};

var pinParams = {
  WIDTH: 50,
  HEIGHT: 70
};

var offerTypesTranslation = {
  flat: 'Квартира',
  palace: 'Дворец',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var map = document.querySelector('.map');
var pinsContainer = document.querySelector('.map__pins');
var filtersContainer = document.querySelector('.map__filters-container');

var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');

// Функция, возвращающая случайный индекс элемента из массива
var getRandomIndexOfArray = function (array) {
  return Math.floor(Math.random() * array.length);
};

// Функция генерации случайного числа в заданном диапазоне, включая концы интервала
var getRandomNumberInRange = function (startNumber, finishNumber) {
  return startNumber + Math.round(Math.random() * (finishNumber - startNumber));
};

// Функция получения пути к изображению
var getPicturePath = function (elementNumber) {
  var pathNumber = elementNumber < 10 ? '0' + elementNumber : elementNumber;

  return 'img/avatars/user' + pathNumber + '.png';
};

// Функция, возвращающая случайно перемешанную копию массива (тасование Фишера — Йетса)
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

// Функция генерации случайного набора удобств для каждого объявления
var getAdFeatures = function () {
  var shuffledFeatures = getShuffledArray(offerParams.FEATURES);
  var randomIndex = getRandomIndexOfArray(shuffledFeatures);

  return shuffledFeatures.slice(0, randomIndex);
};

// Функция создания объявления
var generateSimilarAd = function (adIndex) {
  var x = getRandomNumberInRange(locationParams.X.START, locationParams.X.END);
  var y = getRandomNumberInRange(locationParams.Y.START, locationParams.Y.END);

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

// Функция создания массива похожих объявлений
var generateSimilarAds = function () {
  var randomAds = [];

  for (var i = 0; i < NUM_OF_ADS; i++) {
    randomAds.push(generateSimilarAd(i));
  }

  return randomAds;
};

// Функция создания элемента маркера на карте
var createPinElement = function (pinNumber) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImage = pinElement.querySelector('img');

  pinElement.style.left = (ads[pinNumber].location.x - pinParams.WIDTH / 2) + 'px';
  pinElement.style.top = (ads[pinNumber].location.y - pinParams.HEIGHT) + 'px';
  pinImage.src = ads[pinNumber].author.avatar;
  pinImage.alt = ads[pinNumber].offer.title;

  return pinElement;
};

// Функция создания фрагмента с маркерами на карте
var createPinsFragment = function (numberOfPins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < numberOfPins; i++) {
    fragment.appendChild(createPinElement(i));
  }

  return fragment;
};

// Функция очистки и заполнения списка удобств
var changeFeaturesList = function (list, features) {
  // Очистка списка
  for (var i = list.children.length - 1; i >= 0; i--) {
    list.removeChild(list.children[i]);
  }

  // Добавление существующих удобств
  for (var j = 0; j < features.length; j++) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature', 'popup__feature--' + features[j]);
    list.appendChild(featureItem);
  }
};

// Функция заполнения списка фотографий с последующим удалением пустого шаблона
var fillPhotoList = function (photosList, photos) {
  var photoTemplate = photosList.querySelector('.popup__photo');

  // Удаление пустого шаблона из разметки
  photosList.removeChild(photoTemplate);

  for (var i = 0; i < photos.length; i++) {
    var photo = photoTemplate.cloneNode(true);
    photo.src = photos[i];
    photosList.appendChild(photo);
  }
};

// Функция создания фрагмента карточки с объявлением
var generateInfoCard = function (ad) {
  var card = cardTemplate.cloneNode(true);
  var featuresList = card.querySelector('.popup__features');
  var photosList = card.querySelector('.popup__photos');

  var houseType = ad.offer.type;
  var rooms = ad.offer.rooms;
  var guests = ad.offer.guests;
  var checkin = ad.offer.checkin;
  var checkout = ad.offer.checkout;

  card.querySelector('.popup__avatar').src = ad.author.avatar;
  card.querySelector('.popup__title').textContent = ad.offer.title;
  card.querySelector('.popup__text--address').textContent = ad.offer.address;
  card.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = offerTypesTranslation[houseType];
  card.querySelector('.popup__text--capacity').textContent = rooms + ' комнаты для ' + guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + checkin + ', выезд до ' + checkout;
  card.querySelector('.popup__description').textContent = ad.offer.description;
  changeFeaturesList(featuresList, ad.offer.features);
  fillPhotoList(photosList, ad.offer.photos);

  return card;
};

// Функция инициализации страницы
var initPage = function () {
  // Убираем приветственное сообщение
  map.classList.remove('map--faded');

  // Добавляем маркеры в контейнер
  pinsContainer.appendChild(createPinsFragment(NUM_OF_ADS));

  // Добавляем карточку с информацией
  map.insertBefore(generateInfoCard(ads[INDEX_OF_FULL_DESCRIBED_AD]), filtersContainer);
};

var ads = generateSimilarAds();

initPage();
