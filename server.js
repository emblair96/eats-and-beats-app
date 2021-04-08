const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const SpotifyWebApi = require('spotify-web-api-node');
require("dotenv").config();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded ({ extended: true }));
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  clientId : process.env.CLIENT_ID,
  clientSecret : process.env.CLIENT_SECRET
});

require("./routes/html/htmlRoutes")(app);

spotifyApi.clientCredentialsGrant()
  .then(function(data) {
  
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err.message);
  });

  app.get('/spotifyplaylist/:genre', function (request, response) {
      // Search for a track!
    spotifyApi.searchPlaylists(request.params.genre, {limit: 50})
      .then(function(data) {
      
        // Send the first (only) track object
        response.send(data.body.playlists.items);
      
      }, function(err) {
        console.error(err);
      });
  });
  

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});