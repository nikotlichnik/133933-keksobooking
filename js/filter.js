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
  var filterSelects = filterForm.querySelectorAll('select');
  var checkboxFieldset = filterForm.querySelector('.map__features');

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
   * @const {Object}
   * @property {boolean} checkbox
   * @property {string} select
   */
  var ANY_VALUE = {
    select: 'any'
  };

  /**
   * @enum {string}
   */
  var Prefix = {
    offer: 'housing-'
  };


  /**
   * Сбрасывает состояние фильтра в исходное состояние
   */
  var resetFilter = function () {
    filterForm.reset();
  };

  /**
   * Проверяет соответствует цены в объявлении фильтру
   * @param {number} price
   * @param {string} filterValue
   * @return {boolean}
   */
  var isPriceMatchesFilter = function (price, filterValue) {
    var priceRange = PriceValue[filterValue];
    return price >= priceRange.MIN && price <= priceRange.MAX;
  };

  /**
   *
   * @param {Ad} ad
   * @return {boolean}
   */
  var filterOfferParams = function (ad) {
    var isMatch = true;

    Array.from(filterSelects).forEach(function (select) {
      if (select.value !== ANY_VALUE.select) {
        var filterField = select.id.replace(Prefix.offer, '');

        if (filterField === 'price') {

          if (!isPriceMatchesFilter(ad.offer.price, select.value)) {
            isMatch = false;
          }

        } else if (ad.offer[filterField].toString(10) !== select.value) {
          isMatch = false;
        }
      }
    });

    return isMatch;
  };

  /**
   *
   * @param {Ad} ad
   * @return {boolean}
   */
  var filterFeatures = function (ad) {
    var checkedFeatures = checkboxFieldset.querySelectorAll(':checked');
    var isMatch = true;

    Array.from(checkedFeatures).forEach(function (checkbox) {
      if (ad.offer.features.indexOf(checkbox.value) === -1) {
        isMatch = false;
      }
    });

    return isMatch;
  };

  /**
   * Обновляет содержимое карты в соответствии с фильтром
   */
  var applyPinsFilter = function () {
    var ads = window.map.similarAds.slice();
    ads = ads.filter(filterFeatures);
    ads = ads.filter(filterOfferParams);

    window.card.closeActive();
    window.map.update(ads);
  };

  filterForm.addEventListener('change', window.utils.debounce(applyPinsFilter));

  window.resetFilter = resetFilter;
})();
