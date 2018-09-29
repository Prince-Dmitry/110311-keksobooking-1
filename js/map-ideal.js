'use strict';

var CARDS_AMOUNT = 8;
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var DESCRIPTIONS = 'Великолепная квартира-студия в центре Токио. Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована.';
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var MIN_ROOM = 1;
var MAX_ROOM = 5;
var MIN_LOCATION_X = 100;
var MAX_LOCATION_X = 900;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var IMAGE_NUM_RANGES = [1, 2, 3, 4, 5, 6, 7, 8];

var TypeOfHouses = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var mapPinList = document.querySelector('.map__pins'); // куда вставить метки
var pinTemplate = document.querySelector('#pin') // шаблон метки
  .content
  .querySelector('.map__pin');
var mapCard = document.querySelector('.map'); // куда вставить карточку
var cardTemplate = document.querySelector('#card') // шаблон карточки
  .content
  .querySelector('.map__card');

var getUnique = function (titles) {
  var uniqueEl = titles[getRandom(0, titles.length)];
  titles.splice(titles.indexOf(uniqueEl), 1);
  return uniqueEl;
};

var getRandom = function (min, max) {
  return Math.floor(Math.random() * max + min);
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var getRandomFeatures = function (array) {
  array.length = getRandom(1, array.length);
  return array;
};

// создаёт объект

var createObject = function () {

  var locationX = getRandom(MIN_LOCATION_X, MAX_LOCATION_X);
  var locationY = getRandom(MIN_LOCATION_Y, MAX_LOCATION_Y);
  return {
    author: {
      avatar: 'img/avatars/user0' + getUnique(IMAGE_NUM_RANGES) + '.png'
    },

    offer: {
      title: getUnique(TITLES),
      address: locationX + ', ' + locationY,
      price: getRandom(MIN_PRICE, MAX_PRICE),
      type: TYPES[getRandom(0, TYPES.length)],
      rooms: getRandom(MIN_ROOM, MAX_ROOM),
      guests: getRandom(1, 5),
      checkin: CHECK_TIMES[getRandom(0, CHECK_TIMES.length)],
      checkout: CHECK_TIMES[getRandom(0, CHECK_TIMES.length)],
      features: features,
      description: DESCRIPTIONS,
      photos: PHOTOS.sort(compareRandom),
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

// создаёт массив из 8 объектов

var createData = function () {
  var objects = [];
  for (var i = 0; i < CARDS_AMOUNT; i++) {
    objects.push(createObject());
  }
  return objects;
};

var createFragmentFeatures = function (facilities) {
  var fragmentFeatures = document.createDocumentFragment();
  for (var i = 0; i < facilities.length; i++) {
    var li = document.createElement('li');
    li.classList.add('popup__feature');
    var classAdded = 'popup__feature--' + facilities[i];
    li.classList.add(classAdded);
    fragmentFeatures.appendChild(li);
  }
  return fragmentFeatures;
};

var createFragmentPhotos = function (pins) {
  var fragmentPhotos = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    var img = document.createElement('img');
    img.src = pins[i];
    img.width = 45;
    img.height = 40;
    img.classList.add('popup__photo');
    fragmentPhotos.appendChild(img);
  }
  return fragmentPhotos;
};

var createPins = function (icons) {
  for (var i = 0; i < icons.length; i++) {
    var fragmentPins = document.createDocumentFragment();
    var pinElem = pinTemplate.cloneNode(true);
    pinElem.children[0].src = icons[i].author.avatar;
    pinElem.style.left = icons[i].location.x + 'px';
    pinElem.style.top = icons[i].location.y + 'px';
    pinElem.children[0].alt = icons[i].offer.title;
    fragmentPins.appendChild(pinElem);
    mapPinList.appendChild(fragmentPins);
  }

};

var createCard = function (item) {
  var cardItem = cardTemplate.cloneNode(true);
  var roomNum = item.offer.rooms;
  var guestNum = item.offer.guests;
  var roomPhrase = ' комнат для ';

  var guestPhrase = guestNum === 1 ? ' гостя' : ' гостей';

  if (roomNum === 1) {
    roomPhrase = ' комната для ';
  } else {
    roomPhrase = ' комнаты для ';
  }

  mapCard.insertBefore(cardItem, mapPinList);
  cardItem.querySelector('.popup__title').textContent = item.offer.title;
  cardItem.querySelector('.popup__text--address').textContent = item.offer.address;
  cardItem.querySelector('.popup__text--price').innerHTML = item.offer.price + '&#x20bd/ночь';
  cardItem.querySelector('.popup__type').textContent = TypeOfHouses[item.offer.type];
  cardItem.querySelector('.popup__text--capacity').textContent = roomNum + roomPhrase + ' для ' + guestNum + guestPhrase;
  cardItem.querySelector('.popup__text--time').textContent = 'Заезд после ' + item.offer.checkin + ' выезд после ' + item.offer.checkout;
  var fragmentCard = document.createDocumentFragment();
  var cardFeatures = cardItem.querySelector('.popup__features');
  cardFeatures.innerHTML = '';
  cardFeatures.appendChild(createFragmentFeatures(item.offer.features));
  cardItem.querySelector('.popup__description').textContent = item.offer.description;
  var cardPhotos = cardItem.querySelector('.popup__photos');
  cardPhotos.innerHTML = '';
  cardPhotos.appendChild(createFragmentPhotos(item.offer.photos));
  cardItem.querySelector('.popup__avatar').src = item.author.avatar;

  fragmentCard.appendChild(cardItem);
  mapCard.appendChild(fragmentCard);
  return cardItem;
};

var createItems = function (card) {
  var items = [];
  for (var i = 0; i < CARDS_AMOUNT; i++) {
    items.push(card);
  }
  return items;
};

var features = getRandomFeatures(FEATURES);
var cardsArray = createData(); // массив объектов
createPins(cardsArray); // метки на карте
var oneCard = createCard(cardsArray[0]); // 1 одну карточку
createItems(oneCard); // выводит карточки
