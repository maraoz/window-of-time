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
        'top': y,
        'left': x
      });
    }, delta);
  };
  var moveData = [];

  setTimeout(function() {
    console.log('writing moveData', moveData.length);
    moveData = _.filter(moveData, function(d, i) {
      return i % 5 === 0;
    });
    var data = {
      timestamp: startTime,
      moves: moveData
    };
    console.log(JSON.stringify(data).length);
    console.log(JSONC.pack(JSONC.compress(data)).length);
    $.post('api/write', data, function(response) {
      console.log(response);
    });
  }, 5000);

  $('body').keypress(function(e) {
    e.preventDefault();
    if (e.which === 'q'.charCodeAt(0)) {
      // TODO
      console.log('Q');
    }
  });
  $.get('api/cursors', function(data) {
    var cursors = JSON.parse(data);
    console.log(cursors);
    _.each(cursors, function(cursor) {
      var ts = cursor.timestamp;
      var moves = cursor.moves;
      var img = createMouse();
      _.each(moves, function(move) {
        var tm = parseInt(move[0]);
        var x = midX + parseInt(move[1]);
        var y = midY + parseInt(move[2]);
        moveImg(img, x, y, tm);
      });
    });
  });


  $('body').mousemove(function(e) {
    var x = e.clientX;
    var y = e.clientY;

    var move = [
      new Date().getTime() - startTime,
      x - midX,
      y - midY
    ];
    moveData.push(move);

    moveImg(mainImg, x - 10, y, 0);
  });

});
