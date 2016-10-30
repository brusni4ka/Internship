/**
 * Created by kate on 27/10/16.
 */
var AnimateOnScroll =(function () {

  var  init = function (params) {
    // Capture scroll events
    document.addEventListener('scroll', function () {
      checkAnimation(params);
    });
  };

  function isElementInViewport(elem) {

    // Get the scroll position of the page.
    var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? document.body : document.documentElement);
    var viewportTop = scrollElem.scrollTop;
    var viewportBottom = viewportTop + window.innerHeight;

    // Get the position of the element on the page.
    var elemTop = Math.round(elem.offsetTop);
    var elemBottom = elemTop + elem.offsetHeight;
    return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
  }

// Check if it's time to start the animation.
  function checkAnimation(elements) {
    for (var key in elements) {
      if (elements.hasOwnProperty(key)) {
        var elementsList = document.querySelectorAll(key);
        for (var i = 0; i < elementsList.length; i++) {

          // If the animation has been  started already
          if (elementsList[i].classList.contains('animated')) continue;

          if (isElementInViewport(elementsList[i])) {
            // Start the animation
            elementsList[i].classList.add('animated');
            elements[key](elementsList[i]);
          }

        }
      }
    }
  }
  return {
    init: init
  }
}());


