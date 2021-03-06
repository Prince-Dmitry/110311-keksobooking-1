'use strict';

(function () {
  window.map = {
  // экспортируемая ф-ция сброса формы в начальное состояние (п 1.5 ТЗ)
    initForm: function () {
      formActivate(false);
      // удаление меток
      deleteElementsMap(pinListElement, '.map__pin');
      // удаление объявлений
      deleteElementsMap(mapShow, '.map__card');

      adForm.reset();

      // пересчитываем координату
      addressCoordinatePin.value = defineCoordinatePin(mapPinMain);
      // назаначаем обработчик на главную метку
      mapPinMain.addEventListener('mouseup', onMapMouseUp);

      // сразу запрещаем неправильные варианты кол-ва мест от выбранного кол-ва комнат
      units.relationNumberRoomsCapacity();
    }
  };

  // DOM-объект с блоком карты
  var mapShow = document.querySelector('.map');
  // DOM-объект с формой заполнения объявления
  var adForm = document.querySelector('.ad-form');
  // DOM-объект с формой фильтрации объявлений
  var mapFiltes = document.querySelector('.map__filters');
  // DOM-объект метки объявлений
  var mapPinMain = document.querySelector('.map__pin--main');
  // элемент поля адреса в форме объявления
  var addressCoordinatePin = document.querySelector('#address');
  // блок, куда будут вставлены объекты (метки объявлений)
  var pinListElement = document.querySelector('.map__pins');
  // блок, перед которым нужно вставить объявление
  var cardListElement = document.querySelector('.map__filters-container');
  // блок из шаблона, на основе которого будут выведено сообщение об ошибке при отправке формы
  // var templFormErr = document.querySelector('#error').content.querySelector('.error');
  // блок с сообщением об успешном отправлении формы
  // var elemError = document.querySelector('.error');

  // получаем объекты из модуля data.js
  var aAdvertize = window.data.aAdvertize;
  // получаем ф-цию renderPin из модуля render-рin
  var data = window.data;
  var renderPin = window.renderPin;
  // получаем ф-цию renderCard из модуля render-card
  var renderCard = window.renderCard;
  // экспорт ф-ции relationNumberRoomsCapacity из модуля units.js
  var units = window.units;
  var backend = window.backend;
  // экспорт из модуля message.js
  var message = window.message;

  // ф-ция для определения координаты x блока метки
  function getMapX(x) {
    return x + 50 / 2;
  }

  // ф-ция для определения координаты y блока метки
  function getMapY(y) {
    return y + 70;
  }

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
      y = parseInt(yTmp, 10) + 81;
    }
    return Math.round(x) + ', ' + Math.round(y);
  }

  // ф-ция генерации меток объявлений
  function generatePins() {
    var fragment = document.createDocumentFragment();
    for (var indPin = 0; indPin < aAdvertize.length; indPin++) {
      fragment.appendChild(renderPin(aAdvertize[indPin], onPinClick));
    }
    pinListElement.appendChild(fragment);
  }

  // ф-ция загрузки карточек объявлений
  function loadCard() {
    // отрисовка DOM-объектов (карточка объявления) через DocumentFragment
    var fragmentCard = document.createDocumentFragment();
    for (var indCard = 0; indCard < aAdvertize.length; indCard++) {
      var cardAdvertize = renderCard(aAdvertize[indCard], onCardButtonCloseClick);
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

  // событие на перетаскивание метки объявления
  function onMapMouseUp() {
    backend.load(successHandler, errorHandler); // загружаем данные с сервера и записываем в массив data.aAdvertize
    formActivate(true);
    units.relationNumberRoomsCapacity(); // сразу запрещаем неправильные варианты кол-ва мест от выбранного кол-ва комнат
    mapPinMain.removeEventListener('mouseup', onMapMouseUp); // отписываемся от события
  }

  // ф-ция удаления объектов в разметке
  function deleteElementsMap(elemParent, classElem) {
    var childElement = elemParent.querySelectorAll(classElem);
    for (var indElem = 0; indElem < childElement.length; indElem++) {
      if (childElement[indElem].hasAttribute('data-id')) {
        elemParent.removeChild(childElement[indElem]);
      }
    }
  }

  // ф-ция перетаскивания метки объявления
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var tmpY = mapPinMain.offsetTop - shift.y;
      var tmpX = mapPinMain.offsetLeft - shift.x;

      if (tmpY < data.MIN_Y) {
        tmpY = data.MIN_Y + 'px';
      } else if (tmpY > data.MAX_Y) {
        tmpY = data.MAX_Y + 'px';
      } else {
        tmpY = tmpY + 'px';
      }
      mapPinMain.style.top = tmpY;

      if (tmpX < data.MIN_X) {
        tmpX = data.MIN_X + 'px';
      } else if (tmpX > data.MAX_X) {
        tmpX = data.MAX_X + 'px';
      } else {
        tmpX = tmpX + 'px';
      }
      mapPinMain.style.left = tmpX;
      addressCoordinatePin.value = defineCoordinatePin(mapPinMain);

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (evtDr) {
          evtDr.preventDefault();
          mapPinMain.removeEventListener('click', onClickPreventDefault);
        };
        mapPinMain.addEventListener('click', onClickPreventDefault);
      }

    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // сбрасываем форму в начальное неактивное состояние
  window.map.initForm();

  var successHandler = function (loadAdvertize) {
    aAdvertize = [];
    for (var ii = 0; ii < loadAdvertize.length; ii++) {
      aAdvertize.push(loadAdvertize[ii]);
      aAdvertize[ii].id = ii;
    }
    generatePins(); // загружаем все метки
    loadCard(); // загружаем все объявления
  };

  var errorHandler = function (errorMessage) {
    message.showMessageErrorSendForm('Ошибка! Объявления не были загружены ' + errorMessage);
  };
})();
