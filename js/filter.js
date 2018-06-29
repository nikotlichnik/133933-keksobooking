'use strict';

/**
 * @namespace Filter
 */

/**
 * Промежуток значений
 * @typedef {Object} Range
 * @property {number} MIN
 * @property {number} MAX
 */

(function () {
  var filterForm = document.querySelector('.map__filters');
  var typeSelect = filterForm.querySelector('#housing-type');
  var priceSelect = filterForm.querySelector('#housing-price');
  var roomsSelect = filterForm.querySelector('#housing-rooms');
  var guestsSelect = filterForm.querySelector('#housing-guests');
  var featuresFieldset = filterForm.querySelector('.map__features');

  /**
   * @enum {Range | string}
   */
  var PriceValue = {
    low: {
      MIN: 0,
      MAX: 9999
    },
    middle: {
      MIN: 10000,
      MAX: 50000
    },
    high: {
      MIN: 50001,
      MAX: 10000000
    }
  };

  /**
   * @type {string}
   */
  var ANY_VALUE = 'any';

  /**
   * Сбрасывает состояние фильтра в исходное состояние
   */
  var resetFilter = function () {
    filterForm.reset();
  };

  /**
   * @param {Ad} ad
   * @return {boolean}
   */
  var filterType = function (ad) {
    return typeSelect.value !== ANY_VALUE ? ad.offer.type === typeSelect.value : true;
  };

  /**
   * @param {Ad} ad
   * @return {boolean}
   */
  var filterPrice = function (ad) {
    var priceRange = PriceValue[priceSelect.value];
    return priceRange ? ad.offer.price >= priceRange.MIN && ad.offer.price <= priceRange.MAX : true;
  };

  /**
   * @param {Ad} ad
   * @return {boolean}
   */
  var filterGuests = function (ad) {
    return guestsSelect.value !== ANY_VALUE ? ad.offer.guests.toString(10) === guestsSelect.value : true;
  };

  /**
   * @param {Ad} ad
   * @return {boolean}
   */
  var filterRooms = function (ad) {
    return roomsSelect.value !== ANY_VALUE ? ad.offer.rooms.toString(10) === roomsSelect.value : true;
  };

  /**
   * @param {Ad} ad
   * @return {boolean}
   */
  var filterFeatures = function (ad) {
    var checkedFeatures = featuresFieldset.querySelectorAll(':checked');

    return Array.from(checkedFeatures).every(function (checkbox) {
      return ad.offer.features.indexOf(checkbox.value) !== -1;
    });
  };

  /**
   * Обновляет содержимое карты в соответствии с фильтром
   */
  var applyPinsFilter = function () {
    var ads = window.map.similarAds.slice();
    ads = ads.filter(filterFeatures);
    ads = ads.filter(filterPrice);
    ads = ads.filter(filterType);
    ads = ads.filter(filterGuests);
    ads = ads.filter(filterRooms);

    window.card.closeActive();
    window.map.update(ads);
  };

  filterForm.addEventListener('change', window.utils.debounce(applyPinsFilter));

  window.resetFilter = resetFilter;
})();
