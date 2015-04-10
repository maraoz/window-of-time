'use strict';

$(document).ready(function() {

  console.log('Initializing...');
  var startTime = new Date().getTime();
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
  var midX = $('body').width() / 2;
  var midY = $('body').height() / 2;
  var mainImg = createMouse();
  var moveImg = function(img, x, y, delta) {
    setTimeout(function() {
      img.css({
        //position: 'absolute',
        'top': y,
        'left': x
      });
    }, delta);
  };
  var moveData = [];

  setTimeout(function() {
    console.log('writing moveData', moveData.length);
    $.post('api/write', {
      timestamp: startTime,
      moves: moveData
    }, function(response) {
      console.log(response);
    });
  }, 10000);

  $('body').keypress(function(e) {
    e.preventDefault();
    if (e.which === 'q'.charCodeAt(0)) {
      // TODO
      console.log('Q');
    }
  });
  $.get('api/cursors', function(data) {
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
        moveImg(img, midX + x, midY + y, delta / 10);
      });
    });
  });


  $('body').mousemove(function(e) {
    var x = e.clientX;
    var y = e.clientY;

    var move = [
      new Date().getTime(),
      x - midX,
      y - midY
    ];
    moveData.push(move);
    console.log('adding', move);

    moveImg(mainImg, x - 10, y, 0);
  });

});
