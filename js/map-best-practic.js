'use strict';

// 1 Пункт
// Массивы констант

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

var typeOfHouses = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

var map = document.querySelector('.map');
var mapPinTemplate = document.querySelector('.map__pin');
var mapCard = document.querySelector('.map__card');
var mapBlock = document.querySelector('.map');
var mapFilter = document.querySelector('.map__filters-container');
var mapPinsBlock = document.querySelector('.map__pins');


var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getRandomArrayItem = function (array) {
  var item = array[Math.floor(Math.random() * array.length)];

  return item;
};

var shuffleArray = function (array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var item = array[randomIndex];
    array[randomIndex] = array[i];
    array[i] = item;
  }

  return array;
};

var createRandomLengthArray = function (array) {
  var arrayLength = getRandom(1, array.length);
  var randomArray = [];
  for (var i = 0; i < arrayLength; i++) {
    randomArray[i] = array[i];
  }

  return randomArray;
};

var clearNode = function (node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }

  return node;
};

var createObject = function (adsCount) {
  var ads = [];
  for (var i = 0; i < adsCount; i++) {
    var lacoationX = getRandom(MAP_X_MIN, MAP_X_MAX);
    var lacoationY = getRandom(MAP_Y_MIN, MAP_Y_MAX);

    ads.push({
      author: {
        avatar: AUTHOR_AVATARS[i]
      },
      offer: {
        title: TITLES[i],
        address: lacoationX + ', ' + lacoationY,
        price: getRandom(PRICE_MIN, PRICE_MAX),
        type: getRandomArrayItem(TYPE),
        rooms: getRandom(ROOM_MIN, ROOM_MAX),
        guests: getRandom(GUEST_MIN, GUEST_MAX),
        checkin: getRandomArrayItem(CHECK),
        checkout: getRandomArrayItem(CHECK),
        features: createRandomLengthArray(FEATURES),
        description: '',
        photos: shuffleArray(PHOTOS)
      },
      location: {
        x: lacoationX,
        y: lacoationY
      }
    });
  }

  return ads;
};

var renderPin = function (pin) {
  var pinElement = mapPinTemplate.cloneNode(true);
  var pinImg = pinElement.querySelector('img');

  pinElement.style.left = pin.location.x + (PIN_WIDTH / 2) + 'px';
  pinElement.style.top = pin.location.y - PIN_HEIGHT + 'px';


  pinImg.src = pin.author.avatar;
  pinImg.alt = pin.offer.title;

  return pinElement;
};

var reenderFeatures = function (features) {
  var featuresList = mapCard.querySelector('.popup__features');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < features.length; i++) {
    var feature = featuresList.querySelector('.popup__feature--' + features[i]);
    fragment.appendChild(feature);
  }

  return fragment;
};

var renderPhotos = function (photos) {
  var photoTemplate = mapCard.querySelector('.popup__photo');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < photos.length; i++) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.src = photos[i];
    fragment.appendChild(photoElement);
  }

  return fragment;
};

var renderAd = function (ad) {
  var adElement = mapCard.cloneNode(true);

  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';
  adElement.querySelector('.popup__type').textContent = ad.offer.type;
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  clearNode(adElement.querySelector('.popup__features')).appendChild(reenderFeatures(ad.offer.features));
  adElement.querySelector('.popup__description').textContent = ad.offer.description;
  clearNode(adElement.querySelector('.popup__photos')).appendChild(renderPhotos(ad.offer.photos));
  adElement.querySelector('.popup__avatar').src = ad.author.avatar;

  return adElement;
};

var createPinsList = function (pinsData) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pinsData.length; i++) {
    var pin = renderPin(pinsData[i]);
    fragment.appendChild(pin);
  }

  return fragment;
};

map.classList.remove('map--faded');
var adsData = createObject(NUMBER);

mapPinsBlock.appendChild(createPinsList(adsData));

mapBlock.insertBefore(renderAd(adsData[0]), mapFilter);
