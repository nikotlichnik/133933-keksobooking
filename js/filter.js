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
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var HOUSING_PARAMS = ['type', 'rooms', 'guests'];

  var filterForm = document.querySelector('.map__filters');
  var filterSelects = filterForm.querySelectorAll('select');
  var filterCheckboxes = filterForm.querySelectorAll('.map__checkbox');

  /**
   * @enum {Range}
   */
  var priceValues = {
    low: {
      MIN: 0,
      MAX: 10000
    },
    middle: {
      MIN: 10000,
      MAX: 50000
    },
    high: {
      MIN: 50000,
      MAX: 10000000
    }
  };

  var filter = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any',
    'filter-wifi': false,
    'filter-dishwasher': false,
    'filter-parking': false,
    'filter-washer': false,
    'filter-elevator': false,
    'filter-conditioner': false
  };

  /**
   * Сбрасывает состояние фильтра в исходное состояние
   */
  var resetFilter = function () {
    filter = {
      'housing-type': 'any',
      'housing-price': 'any',
      'housing-rooms': 'any',
      'housing-guests': 'any',
      'filter-wifi': false,
      'filter-dishwasher': false,
      'filter-parking': false,
      'filter-washer': false,
      'filter-elevator': false,
      'filter-conditioner': false
    };

    filterForm.reset();
  };

  /**
   * Проверяет соответствует цена фильтру
   * @param {number} price
   * @return {boolean}
   */
  var checkPrice = function (price) {
    var priceRange = priceValues[filter['housing-price']];
    return price >= priceRange.MIN && price <= priceRange.MAX;
  };

  /**
   * Возвращает true, если удобство выбрано в фильтре и его нет в объявлении
   * @param {string} feature
   * @param {Array.<string>} features
   * @return {boolean}
   */
  var checkFeature = function (feature, features) {
    var isNeeded = filter['filter-' + feature] === true;
    var isNotInList = features.indexOf(feature) === -1;
    return isNeeded && isNotInList;
  };

  /**
   * Возвращает true, если выбрано отличное от "любого" значение фильтра и
   * это значение не совпадает со значением в объявлении
   * @param {string} filterParam
   * @param {string} adParamValue
   * @return {boolean}
   */
  var checkHousingParam = function (filterParam, adParamValue) {
    var filterValue = filter['housing-' + filterParam];
    var isNotAny = filterValue !== 'any';
    var isNotMatchFilter = filterValue !== adParamValue;
    return isNotAny && isNotMatchFilter;
  };

  /**
   * Проверяет соответствует ли объявление фильтру
   * @param {Ad} ad
   * @return {boolean}
   */
  var isMatchFilter = function (ad) {
    for (var i = 0; i < HOUSING_PARAMS.length; i++) {
      var param = HOUSING_PARAMS[i];
      if (checkHousingParam(param, ad.offer[param].toString(10))) {
        return false;
      }
    }

    if (filter['housing-price'] !== 'any' && !checkPrice(ad.offer.price)) {
      return false;
    }

    for (i = 0; i < FEATURES.length; i++) {
      if (checkFeature(FEATURES[i], ad.offer.features)) {
        return false;
      }
    }

    return true;
  };

  /**
   * Обновляет содержимое карты в соответствии с фильтром
   */
  var applyPinsFilter = function () {
    window.card.closeActive();

    var ads = window.map.similarAds.slice(0);
    window.map.update(ads.filter(isMatchFilter));
  };

  Array.from(filterCheckboxes).forEach(function (item) {
    item.addEventListener('change', function (evt) {
      filter[evt.target.id] = evt.target.checked;
    });
  });

  Array.from(filterSelects).forEach(function (item) {
    item.addEventListener('change', function (evt) {
      filter[evt.target.id] = evt.target.value;
    });
  });

  filterForm.addEventListener('change', window.utils.debounce(applyPinsFilter));

  window.resetFilter = resetFilter;
})();
