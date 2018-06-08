'use strict';

var NUM_OF_AVAILABLE_PICTURES = 8;

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
      MAX: 100
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

  for (var i = 1; i <= NUM_OF_AVAILABLE_PICTURES; i++) {
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
  var features = [];
  var shuffledFeatures = getShuffledArray(adParams.offer.FEATURES);
  var numberOfFeatures = getRandomIndexOfArray(shuffledFeatures) + 1;

  for (var i = 0; i < numberOfFeatures; i++) {
    features.push(shuffledFeatures[i]);
  }

  return features;
};

// Функция создания объявления
var generateSimilarAd = function (adNumber) {
  var randomAdData = {
    author: {
      avatar: ''
    },
    offer: {
      title: '',
      address: '',
      price: 0,
      type: '',
      rooms: 0,
      guests: 0,
      checkin: '',
      checkout: '',
      features: [],
      description: '',
      photos: ''
    },
    location: {
      x: 0,
      y: 0
    }
  };

  randomAdData.author.avatar = shuffledPictures[adNumber];

  randomAdData.location.x = getRandomNumberInRange(adParams.LOCATION.X.START, adParams.LOCATION.X.END);
  randomAdData.location.y = getRandomNumberInRange(adParams.LOCATION.Y.START, adParams.LOCATION.Y.END);

  randomAdData.offer.title = shuffledTitles[adNumber];
  randomAdData.offer.price = getRandomNumberInRange(adParams.offer.PRICE.MIN, adParams.offer.PRICE.MAX);
  randomAdData.offer.rooms = getRandomNumberInRange(adParams.offer.ROOMS.MIN, adParams.offer.ROOMS.MAX);
  randomAdData.offer.guests = getRandomNumberInRange(adParams.offer.GUESTS.MIN, adParams.offer.GUESTS.MAX);
  randomAdData.offer.type = adParams.offer.TYPES[getRandomIndexOfArray(adParams.offer.TYPES)];
  randomAdData.offer.checkin = adParams.offer.CHECKINS[getRandomIndexOfArray(adParams.offer.CHECKINS)];
  randomAdData.offer.checkout = adParams.offer.CHECKOUTS[getRandomIndexOfArray(adParams.offer.CHECKOUTS)];
  randomAdData.offer.address = randomAdData.location.x + ', ' + randomAdData.location.y;
  randomAdData.offer.features = getAdFeatures();
  randomAdData.offer.photos = getShuffledArray(adParams.offer.PHOTOS);

  return randomAdData;
};

// Функция создания массива похожих объявлений
var generateSimilarAds = function () {
  var randomAds = [];

  for (var i = 0; i < NUM_OF_AVAILABLE_PICTURES; i++) {
    randomAds.push(generateSimilarAd(i));
  }

  return randomAds;
};


var availablePictures = generateAvailablePictures();

var shuffledPictures = getShuffledArray(availablePictures);
var shuffledTitles = getShuffledArray(adParams.offer.TITLES);

var ads = generateSimilarAds();
