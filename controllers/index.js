var Beer = require('../models/beer.js');

var indexController = {
	index: function(req, res) {
		// 1. Get all the beers from the DB
		Beer.find({}, function(err, beersFromDB){
			// 2. Pass the resulting documents (beers)
			// 		to the render function.
			res.render('index', {
				beers: beersFromDB
			});
		});
	}
};

module.exports = indexController;
