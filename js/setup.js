'use strict';

// 1 Пункт
// Массивы констант

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

var PHOTOS = [];

var MAP_X_MIN = 300;
var MAP_X_MAX = 900;
var MAP_Y_MIN = 100;
var MAP_Y_MAX = 500;

var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;

var OFFER_ROOM_MIN = 1;
var OFFER_ROOM_MAX = 5;
var OFFER_GUESTS_MIN = 1;
var OFFER_GUESTS_MAX = 5;

var LABEL_WIDTH = 5;
var LABEL_HEIGHT = 40;
var NUMBER = 8;

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var mapElement = document.querySelector('.map');
var mapPinsListElement = mapElement.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('article.map__card');
var noticeFormElement = document.querySelector('.notice__form');
var noticeFormFieldsetElements = noticeFormElement.querySelectorAll('fieldset');
var featuresList = card.querySelectorAll('.feature');
var mapFilters = mapElement.querySelector('.map__filters-container');
var mapPinMainElement = mapElement.querySelector('.map__pin--main');
var pinElements = mapPinMainElement.querySelectorAll('.map__pin:not(.map__pin--main)');


var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

function getRandomArr(arr) {
  var arrTemp = arr.slice();
  var newLength = Math.ceil(Math.random() * arrTemp.length);
  var newArray = [];
  for (var i = 0; i < newLength; i++) {
    var randomIndex = Math.floor(Math.random() * arrTemp.length);
    newArray[i] = arrTemp[randomIndex];
    arrTemp.splice(randomIndex, 1);
  }
  return newArray;
}

var announcements = [];
for (var n = 0; n < NUMBER; n++) {
  var locationX = getRandom(MAP_X_MIN, MAP_X_MAX);
  var locationY = getRandom(MAP_Y_MIN, MAP_Y_MAX);
  var numberAvatar = n + 1;
  announcements[n] = {
    author: {
      avatar: 'img/avatars/user0' + numberAvatar + '.png'
    },
    offer: {
      title: TITLES[n],
      address: 'location.' + locationX + ', ' + 'location.' + locationY,
      price: getRandom(PRICE_MIN, PRICE_MAX),
      type: TYPE[getRandom(0, TYPE.length)],
      rooms: getRandom(OFFER_ROOM_MIN, OFFER_ROOM_MAX),
      guests: getRandom(OFFER_GUESTS_MIN, OFFER_GUESTS_MAX),
      checkin: CHECK[getRandom(0, CHECK.length)],
      checkout: CHECK[getRandom(0, CHECK.length)],
      features: getRandomArr(FEATURES),
      description: '',
      photos: PHOTOS

    },
    location: {
      x: locationX,
      y: locationY
    }
  };
}

var getPin = function (ad) {
  var pin = mapPinTemplate.cloneNode(true);
  pin.id = ad.announcementId;
  pin.style.left = (ad.location.x - LABEL_WIDTH) + 'px';
  pin.style.top = (ad.location.y - LABEL_HEIGHT) + 'px';
  pin.querySelector('img').src = ad.author.avatar;
  return pin;
};

var showPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < announcements.length; i++) {
    fragment.appendChild(getPin(announcements[i]));
  }
  mapPinsListElement.appendChild(fragment);
};
showPins();

var typeTranslateRus = function (type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'house':
      return 'Дом';
    default:
      return 'Бунгало';
  }
};

var card = mapCardTemplate.cloneNode(true);

var hideFeatures = function () {
  for (var i = 0; i < featuresList.length; i++) {
    featuresList[i].classList.add('hidden');
  }
};

var showFeatures = function (features) {
  for (var i = 0; i < features.length; i++) {
    featuresList[i].classList.remove('hidden');
  }
};


var fillCard = function (index) {
  var offerItem = announcements[index].offer;
  var articleP = card.querySelectorAll('p');

  card.querySelector('h3').textContent = offerItem.title;
  card.querySelector('small').textContent = offerItem.address;
  card.querySelector('.popup__price').textContent = offerItem.price + ' ₽' + '/ночь';
  card.querySelector('h4').textContent = typeTranslateRus(offerItem.type);
  articleP[2].textContent = offerItem.rooms + ' комнаты для ' + offerItem.guests + ' гостей';
  articleP[3].textContent = 'Заезд после ' + offerItem.checkin + ', выезд до' + offerItem.checkout;
  articleP[4].textContent = offerItem.description;
  card.querySelector('.popup__avatar').src = announcements[index].author.avatar;

  hideFeatures();
  showFeatures(offerItem.features);
};

var disableFields = function () {
  for (var i = 0; i < noticeFormFieldsetElements.length; i++) {
    noticeFormFieldsetElements[i].disabled = true;
  }
};
disableFields();
var enableFields = function () {
  for (var i = 0; i < noticeFormFieldsetElements.length; i++) {
    noticeFormFieldsetElements[i].disabled = false;
  }
};

var hidePins = function () {
  for (var i = 0; i < pinElements.length; i++) {
    pinElements[i].classList.add('hidden');
  }
};
hidePins();

// перетаскивание, открытие карты

mapPinMainElement.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    mapPinMainElement.style.top = (mapPinMainElement.offsetTop - shift.y) + 'px';
    mapPinMainElement.style.left = (mapPinMainElement.offsetLeft - shift.x) + 'px';
  };
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    openMap();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

var openMap = function () {
  mapElement.classList.remove('map--faded');
  for (var i = 0; i < pinElements.length; i++) {
    pinElements[i].classList.remove('hidden');
  }
  noticeFormElement.classList.remove('notice__form--disabled');
  enableFields();
};

mapPinMainElement.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openMap();
  }
});

// открытие-закрытие карточек

card.classList.add('hidden');
mapElement.insertBefore(card, mapFilters);
var cardsClose = document.querySelector('.popup__close');
cardsClose.setAttribute.tabIndex = 0;

var clearPin = function () {
  for (var i = 0; i < pinElements.length; i++) {
    if (pinElements[i].classList.contains('map__pin--active')) {
      pinElements[i].classList.remove('map__pin--active');
    }
  }
};

var openCard = function (index) {
  clearPin();
  pinElements[index].classList.add('map__pin--active');
  fillCard(index);
  card.classList.remove('hidden');
  document.addEventListener('keydown', onEscPress);
};

var closeCard = function () {
  card.classList.add('hidden');
  document.removeEventListener('keydown', onEscPress);
};

var onPinClick = function (index) {
  return function () {
    openCard(index);
  };
};

var onPinEnterPress = function (evt, index) {
  if (evt.keyCode === ENTER_KEYCODE) {
    openCard(index);
  }
};

var onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    card.classList.add('hidden');
    document.querySelector('.map__pin--active').classList.remove('map__pin--active');
  }
};

var onCloseEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeCard();
  }
};

for (var e = 0; e < pinElements.length; e++) {
  pinElements[e].addEventListener('click', onPinClick(e));
  pinElements[e].addEventListener('keydown', onPinEnterPress(e));
}

cardsClose.addEventListener('click', closeCard);
cardsClose.addEventListener('keydown', onCloseEnterPress);


var RoomCount = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  HUNDRED: 100
};
var Capacity = {
  ONE_GUEST: 1,
  TWO_GUESTS: 2,
  THREE_GUESTS: 3,
  NOT_FOR_GUESTS: 0,
};

var FormTitle = {
  MIN: 30,
  MAX: 100
};
var FormValidityMessage = {
  TITLE: 'Введите от 30 до 100 символов.',
  PRICE: 'Укажите желаемую стоимость номера',
};

var hostFormTitle = hostForm.querySelector('#title');
var hostFormPrice = hostForm.querySelector('#price');
var hostFormAddress = hostForm.querySelector('#address');
var hostFormType = hostForm.querySelector('#type');
var hostTimeSelect = hostForm.querySelectorAll('.ad-form__element--time select');
var hostRooms = hostForm.querySelector('#room_number');
var hostPlaces = hostForm.querySelector('#capacity');
var hostPlacesItems = hostPlaces.querySelectorAll('option');

var setAdressFieldValue = function (pinX, pinY) {
  hostFormAddress.value = pinX + ', ' + pinY;
};
  /**
 * Render host pins and remove disabled classes from search form.
 * Updates adress field coordinates value.
 */
var setPageActive = function () {
  hostsMap.classList.remove('map--faded');
  hostForm.classList.remove('ad-form--disabled');
  toggleFields(false);
  setAdressFieldValue(mainPinX - Pin.MAIN_GAP, mainPinY - Pin.MAIN_GAP);
  renderHostsList();
  initHostForm();
};

var setHostMinPrice = function () {
  var minCost = getHostType(hostType.value).minCost;
  var minCost = getHostType(hostFormType.value).minCost;
  hostPrice.min = minCost;
  hostPrice.placeholder = minCost;
  hostFormPrice.min = minCost;
  hostFormPrice.placeholder = minCost;
};

var hostRoomCheck = function () {
  hostPlacesItems.forEach(function (item, i) {
    var room = Number(hostRooms.value);
    var capacity = Number(item.value);
    hostPlacesItems[i].disabled = false;
    if (room === RoomCount.ONE && capacity !== Capacity.ONE_GUEST
      || room === RoomCount.TWO && (capacity !== Capacity.ONE_GUEST
        && capacity !== Capacity.TWO_GUESTS)
      || room === RoomCount.THREE && capacity === Capacity.NOT_FOR_GUESTS
      || room === RoomCount.HUNDRED && capacity !== Capacity.NOT_FOR_GUESTS) {
      item.disabled = true;
    }
    hostPlaces.value = (room === 100) ? 0 : room;
  });
};