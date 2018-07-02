'use strict';

/**
 * @namespace Preview
 */

(function () {
  var FILE_TYPES = ['.gif', '.jpg', '.jpeg', '.png'];
  var DEFAULT_IMAGE_PATH = 'img/muffin-grey.svg';

  var avatarChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var housePhotoTemplate = document.querySelector('template').content.querySelector('.ad-form__photo');
  var houseImageChooser = document.querySelector('#images');
  var houseImagesContainer = document.querySelector('.ad-form__photo-container');

  /**
   * Проверяет соответствует ли файл из input'а одному из возможных расширений
   * @param {Object} file
   * @return {boolean}
   */
  var isPossibleExtension = function (file) {
    return FILE_TYPES.some(function (extension) {
      return file.name.toLowerCase().endsWith(extension);
    });
  };

  avatarChooser.addEventListener('change', function () {
    var file = avatarChooser.files.length ? avatarChooser.files[0] : '';

    if (file && isPossibleExtension(file)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    } else {
      avatarChooser.value = '';
      avatarPreview.src = DEFAULT_IMAGE_PATH;
    }
  });

  houseImageChooser.addEventListener('change', function () {
    // Удаляем существующие превью
    var existingPreviews = document.querySelectorAll('.ad-form__photo');
    Array.from(existingPreviews).forEach(function (item) {
      item.parentNode.removeChild(item);
    });

    // Проверяем, чтобы все файлы были с нужными расширениями
    var isCorrectFileExtensions = Array.from(houseImageChooser.files).every(isPossibleExtension);

    // Отрисовываем новые превью
    if (isCorrectFileExtensions) {
      Array.from(houseImageChooser.files).forEach(function (file) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          var houseImageContainer = housePhotoTemplate.cloneNode(true);
          var houseImageElement = houseImageContainer.querySelector('img');

          houseImageElement.src = reader.result;
          houseImagesContainer.appendChild(houseImageContainer);
        });

        reader.readAsDataURL(file);
      });
    } else {
      houseImageChooser.value = '';
    }
  });
})();
