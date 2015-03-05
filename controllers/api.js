var Beer = require('../models/beer.js');

var apiController = {
  addBeer: function(req, res){
    
    var newBeer = req.body;

    var beer = new Beer(newBeer);

    beer.save(function(err, savedBeer){
      res.send(savedBeer);
    });
  },

  deleteBeer: function(req, res){
    var toDelete = req.body.targetId;
    Beer.findByIdAndRemove(toDelete, function(err, result){
      // Assume success here:
      res.send('success');
    });
  },

  getBeer: function(req, res){
    var beerId = req.params.beer_id;
    // Find the given ID in the database
    Beer.findById(beerId, function(err, result){
      // Send the beer data right back to the requester
      res.send(result);
    });
  },

  editBeer: function(req, res){

    var beerId = req.params.beer_id;
    
    Beer.findByIdAndUpdate(beerId, req.body, function(err, result){
      res.send(result);
    });
  }
};

module.exports = apiController;
