process.env.NODE_ENV = 'test';
var assert = require("assert");
var Beer = require('../models/beer.js');
var indexController = require('../controllers/index.js');
var apiController = require('../controllers/api.js');
var app = require('../app.js');
var request = require('supertest')(app)
  , express = require('express')
  , mongoose = require('mongoose');

var bud = {
  name: 'Budweiser',
  ABV: 5.5,
  type: 'pilsner or lager who knows',
  brewer: 'Inbev'
};
var dummyBeer = {
  name: 'Dummy Beer',
  ABV: 'eleven',
  type: 'Lager',
  brewer: 'Brewery'
};

describe('GET /', function(){

  // beforeEach(function(done) {
  //   done()
  // });

  afterEach(function(done) {
    Beer.remove({}, function(){
      done();
    });
  });

  // it('should fail if ABV not correct type', function(done){
  //   request
  //     .post('/api/addBeer')
  //     .send(dummyBeer)
  //     .expect(function(req){
  //       if(req.body.ABV !== Number(req.body.ABV)){
  //         throw new Error("ABV is not the correct data type");
  //       }

  //     })
  //     .expect(200, done);
  // });

  it('should pass when sent a beer', function(done){
    request
      .post('/api/addBeer')
      .send(bud)
      .expect(function(req){
        if(req.body.ABV !== Number(req.body.ABV)){
          throw new Error("ABV is not the correct data type");
        }
      })
      .expect(function(req){
        var key = req.body;
        if(key.name.length === 0 || key.type.length === 0 || key.brewer.length === 0){
          throw new Error("Data Missing from Object");
        }
      })
      .expect(200, done);
  });

  it('should pass if 200 request is received', function(done){
    request
      .get('/') 
      .expect(/DOCTYPE/)
      .expect('content-type', "text/html; charset=utf-8")
      .expect(200, done);
  });


});

describe('deleteBeer /', function(){

  before(function(done){
    budBeer = new Beer(bud);
    budBeer.save();
    done();
  });

  // after(function(done){
  //   Beer.remove({}, function(){
  //     done();
  //   });
  // });
  
// THIS IS WHERE YOU WERE!!!
// Check to see if Beer.findById finds a beer with the same id as targetId
  it('should pass if the targeted beer is deleted', function(done){
    var targetId = budBeer.id;
    var x = Beer.findById(targetId)
    request
      .post('/api/deleteBeer')
      .send(budBeer)
      .expect(function(req){
        console.log(Beer)
      })
      .expect(200, done);
  });
});
