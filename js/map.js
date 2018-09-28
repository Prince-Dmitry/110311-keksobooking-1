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

function getMapX(x) {
  return x - PIN_WIDTH / 2;
}

function getMapY(y) {
  return y - PIN_HEIGHT;
}

var renderPin = function (objPin) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.setAttribute('data-id', objPin.id);
  pinElement.setAttribute('style', 'left: ' + objPin.location.x + 'px; top: ' + objPin.location.y + 'px;');
  var pinElementImg = pinElement.querySelector('img');
  pinElementImg.setAttribute('src', objPin.author.avatar);
  pinElementImg.setAttribute('alt', 'заголовок объявления');
  pinElement.addEventListener('click', onPinClick);
  return pinElement;
};

var renderCard = function (objCard) {
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.classList.add('hidden');

  cardElement.setAttribute('data-id', objCard.id);
  cardElement.querySelector('.popup__title').textContent = objCard.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = objCard.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = objCard.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = TYPE[objCard.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = objCard.offer.rooms + ' комнаты для ' +
  objCard.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + objCard.offer.checkin +
  ' выезд до ' + objCard.offer.checkout;

  var childElement = cardElement.querySelector('.popup__features').querySelectorAll('li');
  for (i = objCard.offer.features.length; i < FEATURES.length; i++) {
    cardElement.querySelector('.popup__features').removeChild(childElement[i]);
  }

  cardElement.querySelector('.popup__description').textContent = objCard.offer.description;
  childElement = cardElement.querySelector('.popup__photos');
  for (i = 0; i < PHOTOS.length; i++) {
    if (i === 0) {
      childElement.querySelector('img').setAttribute('src', objCard.offer.photos[i]); // изменяем атрибут у элемента из шаблона
    } else {
      var newElement = childElement.querySelector('img').cloneNode(true); // добавляем новый элемент на основе шаблонного
      // newElement.src = objCard.offer.photos[i];
      newElement.setAttribute('src', objCard.offer.photos[i]);
      childElement.appendChild(newElement);
    }
  }
  cardElement.querySelector('.popup__avatar').setAttribute('src', objCard.author.avatar);

  var cardForEvent = cardElement.querySelector('.popup__close');
  cardForEvent.addEventListener('click', onCardButtonCloseClick);

  return cardElement;
};

// функция определения координаты метки объявления
function defineCoordinatePin(elemMapPin) {
  var xTmp = elemMapPin.style.left;
  var yTmp = elemMapPin.style.top;
  // если элемент является сгенерированной меткой объявления (наличие атрибута 'data-id')
  if (elemMapPin.hasAttribute('data-id')) {
    var x = getMapX(parseInt(xTmp, 10));
    var y = getMapY(parseInt(yTmp, 10));
  } else {
    x = parseInt(xTmp, 10) + 65 / 2;
    y = parseInt(yTmp, 10) + 65 / 2;
  }
  return Math.round(x) + ', ' + Math.round(y);
}

// ф-ция генерации меток объявлений
function generatePins() {
  var fragment = document.createDocumentFragment();
  for (var indPin = 0; indPin < aAdvertize.length; indPin++) {
    fragment.appendChild(renderPin(aAdvertize[indPin]));
  }
  pinListElement.appendChild(fragment);
//  debugger;
}

// ф-ция загрузки карточек объявлений
function loadCard() {
  // отрисовка DOM-объектов (карточка объявления) через DocumentFragment
  var fragmentCard = document.createDocumentFragment();
  for (var indCard = 0; indCard < aAdvertize.length; indCard++) {
    var cardAdvertize = renderCard(aAdvertize[indCard]);
    fragmentCard.appendChild(cardAdvertize);
  }
  mapShow.insertBefore(fragmentCard, cardListElement);
}

// функция показа формы карточки объявления
function showCard(idPin) {
  var listCards = document.querySelectorAll('.map__card');
  for (var indCard = 0; indCard < listCards.length; indCard++) {
    var itemCard = listCards[indCard];
    if (itemCard.getAttribute('data-id') === idPin) {
      itemCard.classList.remove('hidden');
    } else {
      itemCard.classList.add('hidden');
    }
  }
}

// функция, скрывающая форму карточки объявления
function closeCard(idPin) {

  var listCards = document.querySelectorAll('.map__card');
  for (var indCard = 0; indCard < listCards.length; indCard++) {
    var itemCard = listCards[indCard];
    if (itemCard.getAttribute('data-id') === idPin) {
      itemCard.classList.add('hidden');
    }
  }
}

// функция перевода формы в невактивное/активное состояние
function formActivate(activate) {

  mapShow.classList.toggle('map--faded', !activate);
  adForm.classList.toggle('ad-form--disabled', !activate);
  mapFiltes.classList.toggle('ad-form--disabled', !activate);

  var childElement = adForm.querySelectorAll('fieldset');
  for (var i = 0; i < childElement.length; i++) {
    if (activate) {
      childElement[i].removeAttribute('disabled');
    } else {
      childElement[i].setAttribute('disabled', true);
    }
  }
}

// событие на нажатие на метку объявления
var onPinClick = function (evt) {
  if (evt.currentTarget.hasAttribute('data-id')) {
    showCard(evt.currentTarget.getAttribute('data-id'));
    addressCoordinatePin.value = defineCoordinatePin(evt.currentTarget);
  }
};

// событие на закрытие карточки объявления
var onCardButtonCloseClick = function (evt) {
  if (evt.currentTarget.parentElement.hasAttribute('data-id')) {
    closeCard(evt.currentTarget.parentElement.getAttribute('data-id'));
  }
};

AUTHOR_AVATARS = mixArray(AUTHOR_AVATARS);
TITLES = mixArray(TITLES);

var aAdvertize = []; // массив из объектов-объявлений

for (var i = 0; i < NUMBER; i++) {
  var tempX = getMapX(getRandom(MAP_X_MIN, MAP_X_MAX));
  var tempY = getMapY(getRandom(MAP_Y_MIN, MAP_Y_MAX));
  var tempRooms = getRandom(ROOM_MIN, ROOM_MAX);
  var tempGuests = tempRooms * getRandom(GUEST_MIN, GUEST_MAX);
  aAdvertize.push({
    author: {
      avatar: AUTHOR_AVATARS[i]
    },
    offer: {
      title: TITLES[i],
      address: tempX + ', ' + tempY,
      price: getRandom(PRICE_MIN, PRICE_MAX),
      type: getRandomArrayItem(TITLES),
      rooms: tempRooms,
      guests: tempGuests,
      checkin: getRandomArrayItem(CHECK),
      checkout: getRandomArrayItem(CHECK),
      features: copyArray(FEATURES, getRandom(1, FEATURES.length)),
      description: '',
      photos: mixArray(PHOTOS)
    },
    location: {
      x: tempX,
      y: tempY
    }
  }
  );
}

// событие на перетаскивание метки объявления
function onMapMouseUp() {
  formActivate(true);
  generatePins(); // загружаем все метки
  loadCard(); // загружаем все объявления
  mapPinMain.removeEventListener('mouseup', onMapMouseUp); // отписываемся от события
}

var mapShow = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var mapFiltes = document.querySelector('.map__filters');
var mapPinMain = document.querySelector('.map__pin--main');
var addressCoordinatePin = document.querySelector('#address');
var pinListElement = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardListElement = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

formActivate(false);
addressCoordinatePin.value = defineCoordinatePin(mapPinMain);
mapPinMain.addEventListener('mouseup', onMapMouseUp);

