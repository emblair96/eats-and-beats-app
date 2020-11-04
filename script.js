





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