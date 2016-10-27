/**
 * Created by kate on 27/10/16.
 */
var circleProgress = function (holder) {

  var cont = holder;
  var circle = cont.getElementsByTagName('svg')[0].lastElementChild;
  var val = cont.getAttribute('data-pct');
  var r = circle.getAttribute('r');
  var c = Math.PI * (r * 2);
  var pct;
  //formula
  for (var i = 0; i <= val; i++) {
    (function (i) {
      setTimeout(function () {
        pct = ((100 - i) / 100) * c;
        circle.style.strokeDashoffset = pct;
        cont.setAttribute('data-pct', i.toString());
      }, i * 50);
    })(i);
  }
};
