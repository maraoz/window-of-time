'use strict';

var _ = require('lodash');
var express = require('express');
var Datastore = require('nedb');
var Promise = require('bluebird');
var bodyParser = require('body-parser');
var multer = require('multer');
var db = Promise.promisifyAll(new Datastore({
  filename: 'db.json',
  autoload: true
}));

var app = express();

app.use(express.static('./'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.get('/api/random', function(req, res) {
  var now = new Date().getTime();
  var current = [0, 0, 0];
  var size = 50;
  var generateMove = function() {
    current[0] += 25 + Math.floor(Math.random() * 100);
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
  var doc = req.body;
  db.insertAsync(doc)
    .then(function() {
      res.send({
        success: true
      });
    })
    .catch(function(err) {
      res.send({
        success: false,
        reason: err
      });
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
