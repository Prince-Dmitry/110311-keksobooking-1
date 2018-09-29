'use strict';

(function () {
  window.data = {
    var AUTHOR_AVATARS = [
      'img/avatars/user01.png',
      'img/avatars/user02.png',
      'img/avatars/user03.png',
      'img/avatars/user04.png',
      'img/avatars/user05.png',
      'img/avatars/user06.png',
      'img/avatars/user07.png',
      'img/avatars/user08.png',
    ];

    var TITLES = [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'];

    var TYPE = [
      'palace',
      'flat',
      'house',
      'bungalo'];

    var CHECK = [
      '12:00',
      '13:00',
      '14:00'];

    var FEATURES = [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'];

    var PHOTOS = [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

    var MAP_X_MIN = 0;
    var MAP_X_MAX = 1050;
    var MAP_Y_MIN = 130;
    var MAP_Y_MAX = 630;
    var PRICE_MIN = 1000;
    var PRICE_MAX = 1000000;
    var ROOM_MIN = 1;
    var ROOM_MAX = 5;
    var GUEST_MIN = 1;
    var GUEST_MAX = 5;
    var PIN_HEIGHT = 70;
    var PIN_WIDTH = 50;
    var NUMBER = 8;
    var ESC_KEYCODE = 27;

  };

  var typeOfHouses = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

    // объект соответствия типа жилья и минимальной стоимости за ночь
    var typeHousingMinPrice = {
      flat: 1000,
      bungalo: 0,
      house: 5000,
      palace: 10000
    };

    function compareRandom() {
      return Math.random() - 0.5;
    }

    function mixArray(arr) {
      return arr.sort(compareRandom);
    }

    function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomArrayItem(array) {
      var item = getRandom(0, array.length - 1);
      return array[item];
    }

    function copyArray(array, length) {
      var arr = [];
      for (var i = 0; i < length; i++) {
        arr.push(array[i]);
      }
      return arr;
    }

    window.data.UTHOR_AVATARS = mixArray(window.data.AUTHOR_AVATARS);
    window.data.TITLES = mixArray(window.data.TITLES);

    var aAdvertize = [];

  for (var i = 0; i < NUMBER; i++) {
    var tempX = getMapX(getRandom(window.data.MAP_X_MIN, window.data.MAP_X_MAX));
    var tempY = getMapY(getRandom(window.data.MAP_Y_MIN, window.data.MAP_Y_MAX));
    var tempRooms = getRandom(window.data.ROOM_MIN, window.data.ROOM_MAX);
    var tempGuests = tempRooms * getRandom(window.data.GUEST_MIN, window.data.GUEST_MAX);
    window.data.aAdvertize.push({
      author: {
        avatar: window.data.AUTHOR_AVATARS[i]
      },
      offer: {
        title: window.data.TITLES[i],
        address: tempX + ', ' + tempY,
        price: getRandom(window.data.PRICE_MIN, window.data.PRICE_MAX),
        type: getRandomArrayItem(window.data.TITLES),
        rooms: tempRooms,
        guests: tempGuests,
        checkin: getRandomArrayItem(window.data.CHECK),
        checkout: getRandomArrayItem(window.data.CHECK),
        features: copyArray(window.data.FEATURES, getRandom(1, window.data.FEATURES.length)),
        description: '',
        photos: mixArray(window.data.PHOTOS)
      },
      location: {
        x: tempX,
        y: tempY
      },
      id: i
    }
    );
  }
})();
