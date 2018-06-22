'use strict';

/**
 * @namespace Utils
 */

(function () {
  /**
   * Возвращает случайно перемешанную копию массива (тасование Фишера — Йетса)
   * @param {Array} array
   * @return {Array} - Перемешанная копия массива
   */
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

  /**
   * @param {Array} array
   * @return {number} - Индекс случайного элемента из массива
   */
  var getRandomIndexOfArray = function (array) {
    return Math.floor(Math.random() * array.length);
  };

  /**
   * @param {number} startNumber - Нижняя граница диапазона
   * @param {number} finishNumber - Верхняя граница диапазона
   * @return {number} - Случайное число в заданном диапазоне, включая концы интервала
   */
  var getRandomNumberInRange = function (startNumber, finishNumber) {
    return startNumber + Math.round(Math.random() * (finishNumber - startNumber));
  };

  window.utils = {
    getShuffledArray: getShuffledArray,
    getRandomIndexOfArray: getRandomIndexOfArray,
    getRandomNumberInRange: getRandomNumberInRange
  };
})();
