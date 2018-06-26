'use strict';

/**
 * @namespace Form
 */

(function () {
  var adForm = document.querySelector('.ad-form');
  var inputElements = adForm.querySelectorAll('input, select, textarea');
  var addressField = adForm.querySelector('#address');
  var titleInput = adForm.querySelector('#title');
  var typeInput = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var checkinInput = adForm.querySelector('#timein');
  var checkoutInput = adForm.querySelector('#timeout');
  var roomNumberInput = adForm.querySelector('#room_number');
  var capacityInput = adForm.querySelector('#capacity');
  var submitButton = adForm.querySelector('.ad-form__submit');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var adFieldsets = adForm.querySelectorAll('.ad-form__element');
  var formSuccessElement = document.querySelector('.success');
  var formErrorElement = document.querySelector('.error');

  /**
   * Минимальные цены разных типов жилья
   * @enum {number}
   */
  var MinPriceConstraints = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  /**
   * Ограничение на связь количества гостей и комнат
   * @enum {Array.<string>} - Возможные варианты числа гостей
   */
  var CapacityConstraint = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var activateForm = function () {
    adForm.classList.remove('ad-form--disabled');
    adFieldsets.forEach(function (item) {
      item.disabled = false;
    });

    checkCapacityConstraint();

    submitButton.addEventListener('click', submitClickHandler);

    titleInput.addEventListener('input', formFieldInputHandler);
    priceInput.addEventListener('input', formFieldInputHandler);
    typeInput.addEventListener('change', typeChangeHandler);
    checkinInput.addEventListener('change', checkinChangeHandler);
    checkoutInput.addEventListener('change', checkoutChangeHandler);
    roomNumberInput.addEventListener('change', roomNumberChangeHandler);

    resetButton.addEventListener('click', resetClickHandler);
  };

  var refreshPriceAttributes = function () {
    var type = typeInput.value;
    var minPrice = MinPriceConstraints[type];

    priceInput.placeholder = minPrice;
    priceInput.min = minPrice;
  };

  var typeChangeHandler = function () {
    refreshPriceAttributes();
  };

  var formFieldInputHandler = function (evt) {
    // Добавляем красную рамку невалидным полям
    var field = evt.target;
    if (field.validity.valid) {
      field.classList.remove('ad-form__element--invalid');
    }
  };

  var checkinChangeHandler = function (evt) {
    setValue(checkoutInput, evt.target.value);
  };

  var checkoutChangeHandler = function (evt) {
    setValue(checkinInput, evt.target.value);
  };

  var roomNumberChangeHandler = function () {
    checkCapacityConstraint();
  };

  var checkFields = function () {
    // Проверяем все поля на валидность
    inputElements.forEach(function (field) {
      // Если поле невалидно - ставим красную рамку
      if (!field.validity.valid) {
        field.classList.add('ad-form__element--invalid');
      }
    });
  };

  /**
   * @param {string} messageText
   */
  var errorFormSendHandler = function (messageText) {
    var errorText = 'Форма не отправлена. ' + messageText;
    window.message.show(formErrorElement, errorText);
  };

  var successFormSendHandler = function () {
    resetFieldsValues();
    window.message.show(formSuccessElement);
  };

  var submitClickHandler = function (evt) {
    evt.preventDefault();

    if (adForm.checkValidity()) {
      window.backend.upload(new FormData(adForm), successFormSendHandler, errorFormSendHandler);
    } else {
      checkFields();
    }
  };

  var resetClickHandler = function () {
    window.map.reset();
    window.card.closeActive();

    resetFieldsValues();
    disableForm();
    removeFormHandlers();
  };

  /**
   * @param {Location} coordinates
   */
  var setAddressValue = function (coordinates) {
    addressField.value = coordinates.x + ', ' + coordinates.y;
  };

  /**
   * Устанавливает значение в поле ввода
   * @param {HTMLInputElement} field - поле, в котором нужно установить значение
   * @param {string} value - значение
   */
  var setValue = function (field, value) {
    field.value = value;
  };

  /**
   * Блокирует для выбора варианты, которые не входят в список доступных
   * @param {Array.<HTMLOptionElement>} options - элементы из списка для выбора
   * @param {Array.<string>} possibleVariants - доступные варианты
   */
  var blockUnavailableVariants = function (options, possibleVariants) {
    options.forEach(function (option) {
      var isPossibleVariant = possibleVariants.indexOf(option.value) !== -1;
      option.disabled = !isPossibleVariant;
    });
  };

  var checkCapacityConstraint = function () {
    var numOfRooms = roomNumberInput.value;
    var capacityVariants = CapacityConstraint[numOfRooms];
    var isPossibleValue = capacityVariants.indexOf(capacityInput.value) !== -1;

    // Если текущий выбранный вариант недоступен, то устанавливаем первый доступный
    capacityInput.value = isPossibleValue ? capacityInput.value : capacityVariants[0];

    blockUnavailableVariants(Array.from(capacityInput.options), capacityVariants);
  };

  var disableForm = function () {
    adForm.classList.add('ad-form--disabled');
    adFieldsets.forEach(function (item) {
      item.disabled = true;
    });
  };

  var removeFormHandlers = function () {
    titleInput.removeEventListener('input', formFieldInputHandler);
    typeInput.removeEventListener('change', typeChangeHandler);
    priceInput.removeEventListener('input', formFieldInputHandler);
    checkinInput.removeEventListener('change', checkinChangeHandler);
    checkoutInput.removeEventListener('change', checkoutChangeHandler);
    roomNumberInput.removeEventListener('change', roomNumberChangeHandler);

    submitButton.removeEventListener('click', submitClickHandler);
    resetButton.removeEventListener('click', resetClickHandler);
  };

  var resetFieldsValues = function () {
    adForm.reset();

    inputElements.forEach(function (input) {
      input.classList.remove('ad-form__element--invalid');
    });

    refreshPriceAttributes();
    setAddressValue(window.map.getAddress());
  };

  // Блокируем поля форм
  adFieldsets.forEach(function (item) {
    item.disabled = true;
  });

  window.form = {
    activate: activateForm,
    setAddressValue: setAddressValue
  };
})();
