var UI = require('ui');
var ajax = require('ajax');
var isClicked = false;

var card = new UI.Card({
  title: "Location",
  subtitle: "Fetching..."
});

card.show();

function bodyof(data)
{
  var pre = "";
  var post = "";
  if (data.address.road != null)
  {
    pre = data.address.road;
    if (data.address.house_number != null)
    { pre += " "+data.address.house_number; }
    pre+="\n";
  }
  if (data.address.city != null)
  { post = data.address.city+"\n"+data.address.state+", "+data.address.country; }
  else if (data.address.town != null)
  { post = data.address.town+"\n"+data.address.state+", "+data.address.country; }
  else if (data.address.city != null)
  { post = data.address.village+"\n"+data.address.state+", "+data.address.country; }
  else
  { post = data.address.state+"\n"+data.address.country; }
  return pre+data.address.postcode+" "+post;
}

navigator.geolocation.getCurrentPosition(function (position)
{
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  var URL = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng;
  ajax({ url: URL, type: 'json' }, function(data)
  {
    card.subtitle("You are here:");
    console.log(JSON.stringify(data));
    
    card.body(bodyof(data));
    card.on('click', 'select', function(event)
    {
      // Perform action here
      isClicked = !isClicked;
      if (isClicked)
      {
        card.body("Coordinates\n" + lat + ", " + lng);
      }
      else
      {
        card.body(bodyof(data));
      }
    });
  }, function (error)
  {
    card.subtitle("-");
  });
});