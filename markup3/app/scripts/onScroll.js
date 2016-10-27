/**
 * Created by kate on 27/10/16.
 */
var AnimateOnScroll = (function () {
  var _window = null;
  var _winH = null;
  var _winY = null;
  var _winBottom = null;

  //Take an object as param (key: className, value: callback)
  var init = function (animated_blocks) {

    if (_window)return;
    _window = window;
    _winH = _window.innerHeight;
    _winY = _window.scrollY;
    _winBottom = (_winY + _winH);
    document.addEventListener('scroll', checkIfInView.bind(checkIfInView,animated_blocks), true)
  };

  function checkIfInView(elements) {
    console.log('here');
    for (var key in elements) {
      if (elements.hasOwnProperty(key)) {
        var elementsList = document.querySelectorAll(key);
        for (var i = 0; i < elementsList.length; i++) {
          if(isVisible(elementsList[i]) && !elementsList[i].classList.contains('animated')){
            elementsList[i].classList.add('animated')
            elements[key](elementsList[i]);
          }

        }
      }
    }
  }
  function isVisible(el) {

    var elH = el.offsetHeight;
      var elTop = el.offsetTop;
      var elBottom = (elTop + elH);
      //check to see if this current container is within viewport
      return  ((elBottom >= _winY) && (elTop <= _winBottom));
    }

  return {
    init: init
  }
}());


