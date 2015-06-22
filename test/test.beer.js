process.env.NODE_ENV = 'test';
var assert = require("assert"),
    Beer = require('../models/beer.js'),
    indexController = require('../controllers/index.js'),
    apiController = require('../controllers/api.js'),
    app = require('../app.js'),
    express = require('express'),
    mongoose = require('mongoose'),
    request = require('supertest')(app),
    chai = require('chai');

// TEST BEERS
var bud = {
  name: 'Budweiser',
  ABV: 5.5,
  type: 'pilsner or lager who knows',
  brewer: 'Inbev'
};
var failureBeer = {
  name: 'Failure Beer',
  ABV: 'eleven',
  type: 'Lager',
  brewer: 'Brewery'
};
var dummyBeer = {
  name: 'Dummy Beer',
  ABV: 11,
  type: 'Lager',
  brewer: 'Brewery'
};

describe('GET /', function(){

  afterEach(function(done) {
    Beer.remove({}, function(){
      done();
    });
  });

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
      .expect(/Biergarten/)
      .expect('content-length', '2435')
      .expect('content-type', "text/html; charset=utf-8")
      .expect(200, done);
  });


});

describe('deleteBeer /', function(){

  before(function(done){
    budBeer = new Beer(bud);
    budBeer.save();
    testBeer = new Beer(dummyBeer);
    testBeer.save();
    done();
  });

  after(function(done){
    Beer.remove({}, function(){
      done();
    });
  });

  it('should pass if the targeted beer is deleted', function(done){
    var targetId = budBeer.id;
    request
      .post('/api/deleteBeer')
      .send(budBeer)
      .expect(function(req){
        Beer.find({}, function(err, beersFromDb){
          beersFromDb.map(function(val){
            if(val._id === targetId){
              throw new Error("Beer was not deleted");
            }
          });
        });
      })
      .expect(200, done);
  });
});

describe('getBeer /', function(){
  before(function(done){
    budBeer = new Beer(bud);
    budBeer.save();
    testBeer = new Beer(dummyBeer);
    testBeer.save();
    done();
  });

  after(function(done){
    Beer.remove({}, function(){
      done();
    });
  });

  it('should pass if the correct beer was found in the db', function(done){
    var targetId = testBeer.id;
    request
      .get('/api/getBeer/' + targetId) //SWITCH OUT TO budBeer.id TO SHOW ERR
      .expect(function(req){
        if(req.body._id !== targetId){
          throw new Error("Returned beer does not match expected");
        }
      })
      .expect(200, done);
  });
});

describe('editBeer /', function(){
  before(function(done){
    budBeer = new Beer(bud);
    budBeer.save();
    testBeer = new Beer(dummyBeer);
    testBeer.save();
    done();
  });

  after(function(done){
    Beer.remove({}, function(){
      done();
    });
  });

  it('should pass if returned item matches expected edits', function(done){
    var targetId = testBeer.id;
    var updateBeerInfo = {
      name: "This Worked Beer",
      ABV: 12,
      type: "Pilsner",
      brewer: "That Brewer"
    };

    request
      .post('/api/editBeer/' + targetId)
      .send(updateBeerInfo)
      .expect(function(req){
        if(req.body.name !== updateBeerInfo.name || req.body.ABV !== updateBeerInfo.ABV || req.body.type !== updateBeerInfo.type || req.body.brewer !== updateBeerInfo.brewer){
          throw new Error("Info does not match expected");
        }
      })
      .expect(200, done);
  });
});
