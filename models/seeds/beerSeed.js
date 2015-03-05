var Beer = require('../beer.js');

Beer.find({}, function(err, documents){
  if(documents.length === 0){
    // Prefill the empty database with some Beer

    var goetzeweizen = new Beer({
      name: 'Goetzeweizen',
      ABV: 4.5,
      type: 'heffeweizen',
      brewer: 'Mason Goetz'
    });
    goetzeweizen.save();

    var odouls = new Beer({
      name: "O'Douls",
      ABV: 0,
      type: 'non alcoholic',
      brewer: 'Coors'
    });
    odouls.save();

    var budweiser = new Beer({
      name: 'Budweiser',
      ABV: 5.5,
      type: 'pilsner or lager who knows',
      brewer: 'Inbev'
    });
    budweiser.save();

  }
});
