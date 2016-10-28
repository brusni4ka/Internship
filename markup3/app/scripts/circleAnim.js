/**
 * Created by kate on 27/10/16.
 */
var circleProgress = function (holder) {
  //getting progress circle
  var circle = holder.getElementsByTagName('svg')[0].lastElementChild;
  var val = holder.getAttribute('data-pct');
  var radius = circle.getAttribute('r');
  var circumference =  (Math.PI * (2 * radius));

  for (var i = 1; i <= val; i++) {
    (function (i) {
      setTimeout(function () {
        circle.style.strokeDashoffset = circumference - ((i / 100) * circumference);
        circle.style.strokeDasharray = circumference;
        holder.setAttribute('data-pct', i.toString());
      }, i * 15);
    })(i);
  }
};


