'use strict';

$(document).ready(function() {

  console.log('Initializing...');

  var createMouse = function() {
    var img = $('<img />', {
      id: 'cursor',
      src: 'public/img/cursor.png',
    });
    img.css({
      position: 'absolute',
    });

    img.appendTo($('body'));
    return img;
  };
  var imgs = _.times(1, createMouse);
  var moveImg = function(img, x, y, delta) {
    setTimeout(function() {
      img.css({
        //position: 'absolute',
        'top': y,
        'left': x
      });
    }, delta);
  };

  $('body').keypress(function(e) {
    e.preventDefault();
    if (e.which === 'q'.charCodeAt(0)) {
      imgs.push(createMouse());
    }
    if (e.which === 'e'.charCodeAt(0)) {
      imgs.pop();
    }
  });
  $.get('api/cursors', function(data) {
    var midX = $('body').width() / 2;
    var midY = $('body').height() / 2;
    var cursors = JSON.parse(data);
    _.each(cursors, function(cursor) {
      var ts = cursor.timestamp;
      var moves = cursor.moves;
      var img = createMouse();
      _.each(moves, function(move) {
        var tm = move[0];
        var x = move[1];
        var y = move[2];
        var delta = tm - ts;
        moveImg(img, midX + x, midY + y, delta/10);
      });
    });
  });


  $('body').mousemove(function(e) {
    var msg = 'Handler for .mousemove() called at ';
    msg += e.pageX + ', ' + e.pageY;

    _.each(imgs, function(img, i) {
      var delta = 150 * i;
      var x = e.clientX - 10;
      var y = e.clientY;
      moveImg(img, x, y, delta);
    });
  });

});
