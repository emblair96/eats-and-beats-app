$(".submitBtn").on("click", function(event) {
  event.preventDefault();
  userInput = $("#userInput").val()
  mealType = $("#mealType").val()
  mealTime = $("#mealTime").val()
  playlistGenre = $("#playlistGenre").val()

  appendRecipe();
  appendPlaylist();
  storeRecipes();
  storePlaylist();

  $("#userInput").val("")
  $("#mealType").val("")
  $("#mealTime").val("")
  $("#playlistGenre").val("")
})

//variable for the meal option: vegetarian
var mealOption = "";
var checkBoxVegetarian = $("#checkVegetarian")

//On click event for the Vegetarian option checkbox 
$("#checkVegetarian").on("change", toggleCheckbox)

//Function to call the data from the checkbox
function toggleCheckbox() {
    if (checkBoxVegetarian === false) {
        checkBoxVegetarian = true
        mealOption = ""
    } else {
        checkBoxVegetarian = false
        mealOption = "&diet=Vegetarian"
    }
}

function appendRecipe() {
// Query URL takes userInput (i.e. chicken, pasta) and mealType (i.e. breakfast, lunch, or dinner) and uses that to generate a list of recipes
var queryURL = "https://api.spoonacular.com/recipes/complexSearch?cuisine=" + userInput + "&query=" + mealType + "," + mealOption + "&instructionsRequired=true&number=100&maxReadyTime=" + mealTime + "&apiKey=89279c0bc943469b848b4a779f09bd6c"
  

// Initial api that generates roughly 100 recipes based on user input; randomly select one of those recipes
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  // Randomly select a recipe by ID; then do an API call to get the source URL of that recipe
  if (response.results.length === 0) {
    alert("uh oh!");
    return false;
  }

  var recipeIndex = Math.floor(Math.random() * (response.results.length - 0) + 0);
  var recipeID = response.results[recipeIndex].id;
  
  var newQueryURL = "https://api.spoonacular.com/recipes/" + recipeID + "/information?apiKey=89279c0bc943469b848b4a779f09bd6c"

  $.ajax({
    url: newQueryURL,
    method: "GET"
  }).then(function(response) {
  
  // Get the source URL of the selected recipe

  var recipeURL = response.sourceUrl;

  // Use the recipe URL to do another API call that allows us to get detailed, step by step instructions
  var newQueryURL2 = "https://api.spoonacular.com/recipes/extract?url=" + recipeURL + "&apiKey=89279c0bc943469b848b4a779f09bd6c";

  // ajax call to get the detailed instructions of the recipe
  $.ajax({
      url: newQueryURL2,
      method: "GET"
    }).then(function(data) {
          $("#instructions").empty();
          //Print title of the recipe
          var title = $("<h3>")
          title.addClass("titleRecipe title is-4")
          title.text(data.title)
          $("#instructions").append(title)

          //Print details of the recipe: serving + time to cook
          var detail = $("<h5>")
          detail.addClass("detailRecipe")
          detail.text("Serving: " + data.servings + " - Ready in: " + data.readyInMinutes + " mins")
          $("#instructions").append(detail)

          //Create ul list for ingredients
          var ulList = $("<ul>")
          ulList.addClass("listRecipe")
          $("#instructions").append(ulList)
          //Print ingedrients
          for (var i=0; i<data.extendedIngredients.length; i++){
              var liList = $("<li>")
              liList.text(data.extendedIngredients[i].name + ": " + data.extendedIngredients[i].measures.us.amount + " " + data.extendedIngredients[i].measures.us.unitShort)
              $(ulList).append(liList)
          }

          //Print title for the recipe
          var instruction = $("<div>")
          instruction.addClass("instructionRecipe")
          instruction.html(data.instructions)
          $("#instructions").append(instruction)
          
          //Print recipe source
          //Print source title
          var sourceTitle = $("<h4>")
          sourceTitle.addClass("sourceTitleRecipe")
          sourceTitle.text("Source:")
          $("#instructions").append(sourceTitle)
          //Print source url
          var source = $("<a>")
          var sourceURL = data.sourceUrl;
          source.addClass("sourceRecipe")
          source.attr("href", sourceURL)
          source.text(sourceURL)
          $("#instructions").append(source)        
    })

        
})
})
}

function appendPlaylist() {
  $("#playlist").html("")

  $.get('/spotifyplaylist/' + playlistGenre, function(data) {
    var playlistCount = data.length;

    var playlistIndex = Math.floor(Math.random() * (playlistCount))

    var playlistId = data[playlistIndex].id

    var playlistContent = "<iframe src='https://open.spotify.com/embed/playlist/" + playlistId + "' " + " width='500' height='800' frameborder='0' allowtransparency='true' allow='encrypted-media'></iframe>"

    console.log('CONTENT', playlistContent)
    
    $("#playlist").append(playlistContent)

  });
}

function storeRecipes() {
  localStorage.setItem("User Input", JSON.stringify(userInput));
  localStorage.setItem("Meal Type", JSON.stringify(mealType));
  localStorage.setItem("Meal Time", JSON.stringify(mealTime));
  localStorage.setItem("Meal Option", JSON.stringify(mealOption));
}

function storePlaylist() {
  localStorage.setItem("Playlist genre", JSON.stringify(playlistGenre))
}

$(".tryAgainBtn").on("click", function() {
  $("#playlist").html("")

  var userInput = localStorage.getItem("User Input");
  var mealType = localStorage.getItem("Meal Type");
  var mealTime = localStorage.getItem("Meal Time");
  var mealOption = localStorage.getItem("Meal Option");
  var playlistGenre = localStorage.getItem("Playlist genre");

  appendRecipe();
  appendPlaylist();
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