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
  var PRICE_PARAM = 'price';

  var filterForm = document.querySelector('.map__filters');
  var filterSelects = filterForm.querySelectorAll('select');
  var filterCheckboxes = filterForm.querySelectorAll('.map__checkbox');

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
    checkbox: false,
    select: 'any'
  };

  /**
   * @enum {string}
   */
  var Prefix = {
    features: 'filter-',
    offer: 'housing-'
  };

  var filter = {};

  /**
   * Сбрасывает состояние фильтра в исходное состояние
   */
  var resetFilter = function () {
    filter = {};

    filterForm.reset();
  };

  /**
   * Проверяет соответствует цены в объявлении фильтру
   * @param {number} price
   * @return {boolean}
   */
  var isPriceMatchesFilter = function (price) {
    if (filter[PRICE_PARAM]) {
      var priceRange = PriceValue[filter[PRICE_PARAM]];
      return price >= priceRange.MIN && price <= priceRange.MAX;
    }
    return true;
  };

  /**
   * Проверяет наличие выбранного в фильтре удобства у объявления
   * @param {string} feature
   * @param {Array.<string>} features
   * @return {boolean}
   */
  var isFeatureMatchesFilter = function (feature, features) {
    return filter[feature] ? features.indexOf(feature) !== -1 : true;
  };

  /**
   * Проверяет наличие выбранного в фильтре значения у объявления
   * @param {string} offerParam
   * @param {string} adParamValue
   * @return {boolean}
   */
  var isOfferParamMatchesFilter = function (offerParam, adParamValue) {
    return filter[offerParam] ? filter[offerParam] === adParamValue : true;
  };

  /**
   * Проверяет соответствует ли объявление фильтру
   * @param {Ad} ad
   * @return {boolean}
   */
  var isMatchFilter = function (ad) {
    for (var i = 0; i < HOUSING_PARAMS.length; i++) {
      var param = HOUSING_PARAMS[i];
      if (!isOfferParamMatchesFilter(param, ad.offer[param].toString(10))) {
        return false;
      }
    }

    if (!isPriceMatchesFilter(ad.offer.price)) {
      return false;
    }

    for (i = 0; i < FEATURES.length; i++) {
      if (!isFeatureMatchesFilter(FEATURES[i], ad.offer.features)) {
        return false;
      }
    }

    return true;
  };

  /**
   * Получает значения фильтра из переданного массива элементов
   * @param {NodeListOf<HTMLElement>} inputElements
   * @param {string} inputType
   * @param {string} attribute
   * @param {string} prefix
   */
  var getFilterItems = function (inputElements, inputType, attribute, prefix) {
    Array.from(inputElements).forEach(function (item) {
      if (item[attribute] !== ANY_VALUE[inputType]) {
        filter[item.id.replace(prefix, '')] = item[attribute];
      }
    });
  };

  /**
   * Заполняет массив с фильтром
   */
  var getFilter = function () {
    filter = {};

    getFilterItems(filterCheckboxes, 'checkbox', 'checked', Prefix.features);
    getFilterItems(filterSelects, 'select', 'value', Prefix.offer);
  };

  /**
   * Обновляет содержимое карты в соответствии с фильтром
   */
  var applyPinsFilter = function () {
    getFilter();
    window.card.closeActive();

    var ads = window.map.similarAds.slice();
    window.map.update(ads.filter(isMatchFilter));
  };

  filterForm.addEventListener('change', window.utils.debounce(applyPinsFilter));

  window.resetFilter = resetFilter;
})();
