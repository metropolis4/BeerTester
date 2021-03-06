var express = require('express'),
		bodyParser = require('body-parser'),
		indexController = require('./controllers/index.js'),
		apiController = require('./controllers/api.js'),
		config = require('./config'),
		mongoose = require('mongoose');

// UNCOMMENT TO SEED DB// Mongoose

// Seed the database:
// require('./models/seeds/beerSeed.js');

var app = express();
app.set('dbURL', config.db[app.settings.env]);
console.log("app settings env : " ,app.settings.env);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
mongoose.connect(app.get('dbURL'));

app.get('/', indexController.index);

// api routes
app.post('/api/addBeer', apiController.addBeer);
app.post('/api/deleteBeer', apiController.deleteBeer);
app.get('/api/getBeer/:beer_id', apiController.getBeer);
app.post('/api/editBeer/:beer_id', apiController.editBeer);

var server = app.listen(3148, function() {
	console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
