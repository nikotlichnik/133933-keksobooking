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
  var filterFields = filterForm.querySelectorAll('input, select');
  var typeSelect = filterForm.querySelector('#housing-type');
  var priceSelect = filterForm.querySelector('#housing-price');
  var roomsSelect = filterForm.querySelector('#housing-rooms');
  var guestsSelect = filterForm.querySelector('#housing-guests');
  var featuresFieldset = filterForm.querySelector('.map__features');

  /**
   * @enum {Range}
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
   * @param {Array.<Ad>} ads
   */
  var activateFilters = function (ads) {
    window.filter.ads = ads;
    filterFields.forEach(function (item) {
      item.disabled = false;
    });
  };

  var deactivateFilters = function () {
    filterFields.forEach(function (item) {
      item.disabled = true;
    });
  };

  /**
   * Сбрасывает состояние фильтра в исходное состояние
   */
  var resetFilter = function () {
    deactivateFilters();
    filterForm.reset();
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
  var filterFeatures = function (ad) {
    var checkedFeatures = featuresFieldset.querySelectorAll(':checked');

    return Array.from(checkedFeatures).every(function (checkbox) {
      return ad.offer.features.indexOf(checkbox.value) !== -1;
    });
  };

  /**
   * Возвращает функцию-фильтр для сравнения значения из поля select и поля в объекте
   * @param {HTMLSelectElement} selectElement
   * @param {string} property - Поле в объекте ad
   * @return {Function}
   */
  var createFilter = function (selectElement, property) {
    return function (ad) {
      return selectElement.value !== ANY_VALUE ? ad.offer[property].toString(10) === selectElement.value : true;
    };
  };

  /**
   * Обновляет содержимое карты в соответствии с фильтром
   */
  var applyPinsFilter = function () {
    var ads = window.filter.ads.slice();
    ads = ads.filter(filterFeatures);
    ads = ads.filter(filterPrice);
    ads = ads.filter(createFilter(typeSelect, 'type'));
    ads = ads.filter(createFilter(guestsSelect, 'guests'));
    ads = ads.filter(createFilter(roomsSelect, 'rooms'));

    window.card.closeActive();
    window.map.update(ads);
  };

  filterForm.addEventListener('change', window.utils.debounce(applyPinsFilter));
  deactivateFilters();

  window.filter = {
    reset: resetFilter,
    activate: activateFilters,
    deactivate: deactivateFilters
  };
})();
