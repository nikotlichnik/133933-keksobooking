'use strict';

var NUM_OF_ADS = 8;
var INDEX_OF_FULL_DESCRIBED_AD = 0;

var adParams = {
  offer: {
    TITLES: ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
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
    PHOTOS: ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
  },
  LOCATION: {
    X: {
      START: 300,
      END: 900
    },
    Y: {
      START: 130,
      END: 630
    }
  }
};

var pinParams = {
  WIDTH: 50,
  HEIGHT: 70
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

// Функция генерации путей доступных изображений
var generateAvailablePictures = function () {
  var paths = [];

  for (var i = 1; i <= NUM_OF_ADS; i++) {
    var picturePath = 'img/avatars/user0' + i + '.png';
    paths.push(picturePath);
  }

  return paths;
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
  var shuffledFeatures = getShuffledArray(adParams.offer.FEATURES);
  var randomIndex = getRandomIndexOfArray(shuffledFeatures);

  return shuffledFeatures.slice(0, randomIndex);
};

// Функция создания объявления
var generateSimilarAd = function (adNumber) {
  var x = getRandomNumberInRange(adParams.LOCATION.X.START, adParams.LOCATION.X.END);
  var y = getRandomNumberInRange(adParams.LOCATION.Y.START, adParams.LOCATION.Y.END);

  return {
    author: {
      avatar: shuffledPictures[adNumber]
    },
    offer: {
      title: shuffledTitles[adNumber],
      address: x + ', ' + y,
      price: getRandomNumberInRange(adParams.offer.PRICE.MIN, adParams.offer.PRICE.MAX),
      type: adParams.offer.TYPES[getRandomIndexOfArray(adParams.offer.TYPES)],
      rooms: getRandomNumberInRange(adParams.offer.ROOMS.MIN, adParams.offer.ROOMS.MAX),
      guests: getRandomNumberInRange(adParams.offer.GUESTS.MIN, adParams.offer.GUESTS.MAX),
      checkin: adParams.offer.CHECKINS[getRandomIndexOfArray(adParams.offer.CHECKINS)],
      checkout: adParams.offer.CHECKOUTS[getRandomIndexOfArray(adParams.offer.CHECKOUTS)],
      features: getAdFeatures(),
      description: '',
      photos: getShuffledArray(adParams.offer.PHOTOS)
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
var createPinsFragment = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < NUM_OF_ADS; i++) {
    fragment.appendChild(createPinElement(i));
  }

  return fragment;
};

// Функция перевода типа жилья на русский язык
var getRussianHouseType = function (adNumber) {
  var type = ads[adNumber].offer.type;
  var russianType = 'Квартира';

  switch (type) {
    case 'bungalo':
      russianType = 'Бунгало';
      break;
    case 'house':
      russianType = 'Дом';
      break;
    case 'palace':
      russianType = 'Дворец';
      break;
  }

  return russianType;
};

// Функция получения описания цены в объявлении
var getHousePrice = function (adNumber) {
  var price = ads[adNumber].offer.price;

  return price + '₽/ночь';
};

// Функция получения описания вместимости жилья
var getCapacityOfHouse = function (adNumber) {
  var rooms = ads[adNumber].offer.rooms;
  var guests = ads[adNumber].offer.guests;

  return rooms + ' комнаты для ' + guests + ' гостей';
};

// Функция получения описания часов заезда/выезда
var getCheckinCheckoutHours = function (adNumber) {
  var checkin = ads[adNumber].offer.checkin;
  var checkout = ads[adNumber].offer.checkout;

  return 'Заезд после ' + checkin + ', выезд до ' + checkout;
};

// Функция удаления неуказанных в конкретном объявлении удобств из полного списка
var changeFeaturesList = function (list, adNumber) {
  var currentAdFeatures = ads[adNumber].offer.features;
  var allFeatures = adParams.offer.FEATURES;

  for (var i = 0; i < allFeatures.length; i++) {
    if (!currentAdFeatures.includes(allFeatures[i])) {
      var featureItem = list.querySelector('.popup__feature--' + allFeatures[i]);
      list.removeChild(featureItem);
    }
  }
};

// Функция заполнения списка фотографий с последующим удалением пустого шаблона
var fillPhotoList = function (photosList, adNumber) {
  var photoTemplate = photosList.querySelector('.popup__photo');
  var photos = ads[adNumber].offer.photos;

  for (var i = 0; i < photos.length; i++) {
    var photo = photoTemplate.cloneNode(true);
    photo.src = photos[i];
    photosList.appendChild(photo);
  }

  photoTemplate.parentNode.removeChild(photoTemplate);
};

// Функция создания фрагмента карточки с объявлением
var generateInfoCard = function (adNumber) {
  var card = cardTemplate.cloneNode(true);
  var featuresList = card.querySelector('.popup__features');
  var photosList = card.querySelector('.popup__photos');

  card.querySelector('.popup__avatar').src = ads[adNumber].author.avatar;
  card.querySelector('.popup__title').textContent = ads[adNumber].offer.title;
  card.querySelector('.popup__text--address').textContent = ads[adNumber].offer.address;
  card.querySelector('.popup__text--price').textContent = getHousePrice(adNumber);
  card.querySelector('.popup__type').textContent = getRussianHouseType(adNumber);
  card.querySelector('.popup__text--capacity').textContent = getCapacityOfHouse(adNumber);
  card.querySelector('.popup__text--time').textContent = getCheckinCheckoutHours(adNumber);
  card.querySelector('.popup__description').textContent = ads[adNumber].offer.description;
  changeFeaturesList(featuresList, adNumber);
  fillPhotoList(photosList, adNumber);

  return card;
};

// Функция инициализации страницы
var initPage = function () {
  // Убираем приветственное сообщение
  map.classList.remove('map--faded');

  // Добавляем маркеры в контейнер
  pinsContainer.appendChild(createPinsFragment());

  // Добавляем карточку с информацией
  map.insertBefore(generateInfoCard(INDEX_OF_FULL_DESCRIBED_AD), filtersContainer);
};

var availablePictures = generateAvailablePictures();
var shuffledPictures = getShuffledArray(availablePictures);
var shuffledTitles = getShuffledArray(adParams.offer.TITLES);
var ads = generateSimilarAds();

initPage();
