$(".submitBtn").on("click", function() {
    event.preventDefault();
    userInput = $("#userInput").val()
    mealType = $("#mealType").val()
    mealTime = $("#mealTime").val()
    console.log(mealTime)


    // Query URL takes userInput (i.e. chicken, pasta) and mealType (i.e. breakfast, lunch, or dinner) and uses that to generate a list of recipes
    var queryURL = "https://api.spoonacular.com/recipes/search?cuisine=" + userInput + "," + mealType + "&number=100&apiKey=89279c0bc943469b848b4a779f09bd6c"
    

    // Initial api that generates roughly 100 recipes based on user input; randomly select one of those recipes
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(queryURL)
        // Get the source URL of the selected recipe
        var recipeIndex = Math.floor(Math.random() * (99 - 0) + 0)
        var recipeURL = response.results[recipeIndex].sourceUrl;

        // Use the recipe URL to do another API call that allows us to get detailed, step by step instructions
        var newQueryURL = "https://api.spoonacular.com/recipes/extract?url=" + recipeURL + "&apiKey=89279c0bc943469b848b4a779f09bd6c";


        // ajax call to get the detailed instructions of the recipe
        $.ajax({
            url: newQueryURL,
            method: "GET"
          }).then(function(response) {
            console.log(newQueryURL)
            var instructions = response.instructions;
            var ingredientsArr = response.extendedIngredients
            console.log(response.extendedIngredients[0].original)

            // for (var i=0; i<ingredientsArr; i++) {
            //   var ingredient = ingredientsArr[i].original
            //   ingredientP = $("<p>")
            //   ingredientP.text(ingredient)
            //   $("#instructions").append(ingredientP)
            // }
        
          
            $("#instructions").html(instructions)
        
          })

          // Get a playlist based on mealType (breakfast, lunch, or dinner)
          
          var deezerQueryURL = ("https://api.deezer.com/search/playlist/?q=" + mealType + "&app_id=443882");


          $.ajax({
            url: deezerQueryURL,          
            type: 'GET',
            dataType: 'json',
            cors: true,
            contentType:'application/json',
            secure: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              "Content-Security-Policy": "upgrade-insecure-requests",
            },
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("Authorization", "Basic " + btoa(""));
            },
          }).then(function(response) {
            console.log(deezerQueryURL)
            console.log(response)
            console.log(response.data[0].title)
            var playlistCount = response.data.length
            
            var playlistIndex = Math.floor(Math.random() * (playlistCount))

            var playlistID = response.data[playlistIndex].id
            console.log(playlistID)


            // Embed the playlist on the page
            var newDeezerQueryURL = ("https://api.deezer.com/oembed?url=http://www.deezer.com/playlist/" + playlistID + "&height=500&app_id=443882")

            $.ajax({
            url: newDeezerQueryURL,  
            type: 'GET',
            dataType: 'json',
            cors: true,
            contentType:'application/json',
            secure: true,
              headers: {
                'Access-Control-Allow-Origin': '*',
                "Content-Security-Policy": "upgrade-insecure-requests",
              },
              beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(""));
              },
            }).then(function(response) {
              var widgetHTML = response.html;
              $("#playlist").html(widgetHTML)
          
            })
                 
          })
            
      })
  })





/*
on click event associated with user input/search button
Create 3 variables: general user search, meal type (breakfast, lunch, dinner), and recipe length/time 
Create an array to store last search in local storage OR the last recipe that gets generated
The general search, the meal type, and the recipe length/time variables all get included in the queryURL for the Edamam API call
Select a recipe based on the API call
Append information about the recipe to the page (title, ingredients, recipe steps, photo)
    - Be sure to clear out div prior to appending new content

Take the meal type and the recipe length/time and use that in the Deezer API call to randomly select a playlist
    - Set meal type selection to title parameter in Deezer API
    - Use the recipe length/time to match the duration parameter in the Deezer API
    - Filter out explicit lyrics
Generate a random number and use that number to access a playlist located at that particular index
    var randomNum = Math.floor(Math.random(playlist.length)) 
    playlist = [1, 2, 3]
    playlist[randomNum]
Append the randomly selected playlist to the page
*/