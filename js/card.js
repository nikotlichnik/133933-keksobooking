'use strict';

/**
 * @namespace Card
 */

(function () {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

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
      window.map.closeActiveCard();
    });

    return card;
  };

  window.card = {
    generate: generateInfoCard
  };
})();
