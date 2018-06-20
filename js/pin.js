'use strict';

/**
 * @namespace Pin
 */

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

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
   * @param {Ad} ad - Объявление
   * @return {Node} - Маркер для карты
   */
  var createPinElement = function (ad) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.addEventListener('click', function () {
      window.map.openCard(ad);
      window.map.setActivePin(pinElement);
    });

    pinElement.style.left = (ad.location.x - pinParams.WIDTH / 2) + 'px';
    pinElement.style.top = (ad.location.y - pinParams.HEIGHT) + 'px';
    pinImage.src = ad.author.avatar;
    pinImage.alt = ad.offer.title;

    return pinElement;
  };

  window.pin = {
    create: createPinElement
  };
})();
