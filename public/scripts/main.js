// CLIENT-SIDE

/**
 * Handle submission of the new beer form
 */
var onBeerSubmit = function(e){
  // Prevent default submission behavior
  e.preventDefault();

  // Get data from form inputs:
  //  The keys of this object need to match
  //  up with the keys in our schema because
  //  we are just directly storing the submitted
  //  object into the database with req.body
  //  on the server-side.
  var newBeerData = {
    name: $('#beer-name').val(),
    ABV: parseFloat($('#beer-abv').val()),
    type: $('#beer-type').val(),
    brewer: $('#beer-brewer').val()
  };

  // Reset the form easily
  this.reset();

  // Add validation here if necessary

  // If the data is good, let's make an ajax call
  $.post('/api/addBeer', newBeerData, function(dataFromServer){
    console.log('DataFromServer:', dataFromServer);

    // Add the new beer to the list
    // $('#beer-list').append(
    //   '<li>' + dataFromServer.name + '</li>'
    // );

    // Clone the first beer in the list:
    //  Works in a pinch, but if there are no beers
    //  in the list to get, then this will fail
    var newBeerEl = $('.beer').first().clone();
    newBeerEl.find('strong').text(dataFromServer.name);
    newBeerEl.attr('data-id', dataFromServer._id);
    $('#beer-list').append(newBeerEl);
  });
};


/**
 * Handle clicking "delete" on any beer in the list
 */

var beerDelete = function(e){
  e.preventDefault();

  var originalBeerElement = $(this).closest('.beer');
  var targetId = originalBeerElement.attr('data-id');

  $.post('/api/deleteBeer', {targetId: targetId}, function(dataFromServer){
    // When a success response is sent back
    originalBeerElement.remove();
  });
};

var beerView = function(e){
  e.preventDefault();

  $('#view-modal').modal('show');

  // get the details of the clicked beer
  // from the server

  var originalBeerElement = $(this).closest('.beer');
  var targetId = originalBeerElement.attr('data-id');

  $.get('/api/getBeer/' + targetId, function(dataFromServer){
    $('#view-modal .beer-name').text(dataFromServer.name);
    $('#view-modal .beer-abv').text(dataFromServer.ABV);
    $('#view-modal .beer-type').text(dataFromServer.type);
    $('#view-modal .beer-brewer').text(dataFromServer.brewer);
  });
};


var beerEdit = function(e){
  e.preventDefault();

  $('#edit-modal').modal('show');

  var originalBeerElement = $(this).closest('.beer');
  var targetId = originalBeerElement.attr('data-id');

  $.get('/api/getBeer/' + targetId, function(dataFromServer){
    $('#edit-modal .beer-name').val(dataFromServer.name);
    $('#edit-modal .beer-abv').val(dataFromServer.ABV);
    $('#edit-modal .beer-type').val(dataFromServer.type);
    $('#edit-modal .beer-brewer').val(dataFromServer.brewer);
    $('#edit-modal .beer-id').val(dataFromServer._id);
  });
};

var beerEditSubmit = function(e){
  e.preventDefault();

  var dataFromClient = {
    name: $('#edit-modal .beer-name').val(),
    ABV: $('#edit-modal .beer-abv').val(),
    type: $('#edit-modal .beer-type').val(),
    brewer: $('#edit-modal .beer-brewer').val()
  };

  var targetId = $('#edit-modal .beer-id').val();

  $.post('/api/editBeer/' + targetId, dataFromClient, function(dataFromServer){
    console.log(dataFromServer);

    // Hide the modal in the end
    $('#edit-modal').modal('hide');

    // Update the on-page DOM element
    $('[data-id="'+targetId+'"]')
      .find('strong')
      .text(dataFromServer.name);
  });
};

// Initialize the event listeners
$(document).on('ready', function(){

  // When submitting the new-beer form,
  // use AJAX to post the data
  $('#new-beer').on('submit', onBeerSubmit);


  // Handle deletion clicks
  $(document).on('click', '.delete', beerDelete);

  // Handle view clicks
  $(document).on('click', '.view', beerView);

  // Handle edit clicks
  $(document).on('click', '.edit', beerEdit);

  // Handle submitting the edit form
  $('#edit-form').on('submit', beerEditSubmit);
});
