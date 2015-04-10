'use strict';

var _ = require('lodash');
var express = require('express');
var Datastore = require('nedb');
var Promise = require('bluebird');
var db = Promise.promisifyAll(new Datastore({
  filename: 'db.json',
  autoload: true
}));

var app = express();

app.use(express.static('./'));

app.get('/api/random', function(req, res) {
  var now = new Date().getTime();
  var current = [now, 0, 0];
  var size = 50;
  var generateMove = function() {
    current[0] += 250 + Math.floor(Math.random() * 1000);
    current[1] += -size / 2 + Math.floor(Math.random() * size);
    current[2] += -size / 2 + Math.floor(Math.random() * size);
    return current.slice();
  };
  var doc = {
    timestamp: now,
    moves: _.times(10 + Math.floor(Math.random() * 100), generateMove)
  };
  db.insertAsync(doc)
    .then(function(newDoc) {
      res.send(newDoc);
    });
});
app.post('/api/write', function(req, res) {
  console.log(req.body);
  var doc = JSON.parse(req.body);
  db.insertAsync(doc)
    .then(function(newDoc) {
      res.send(newDoc);
    });
});
app.get('/api/cursors', function(req, res) {
  db.find({}).exec(function(err, docs) {
    res.send(JSON.stringify(docs));
  });
});

var server = app.listen(3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);

});
