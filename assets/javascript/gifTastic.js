$(document).ready(function() {
    
    // Initial array of cartoons
    var cartoons = ["Daffy Duck", "Wile E. Coyote", "Bugs Bunny", "Elmer Fudd",
    "Sylvester the Cat", "Tweety Bird", "Yosemite Sam", "Foghorn Leghorn"];

    var currentCartoon = "";
    var gifCount = 10;

    // Calls function to display the intial buttons
    renderInitialButtons();

    // Adds click event listeners to all elements with a class of "cartoonH"
    $(document).on("click", ".cartoonH", displayCartoonInfo);

    // Adds click event listeners to all elements with a class of "gif"
    $(document).on("click", ".gif", animate);

    // Adds a click event listener to the element with an id of "add-gifs"
    $(document).on("click", "#add-gifs", displayMoreGifs);

    // Adds a click event listener to element with an id of "add-cartoon"
    $(document).on("click", "#add-cartoon", addCartoon);
        
    // Function for displaying initial cartoon buttons from the array
    function renderInitialButtons() {

        // Loops through the array of cartoons
        for (var i = 0; i < cartoons.length; i++) {
            renderNewButton(i);
        }
    };
    
    // This generates new buttons
    function renderNewButton(i) {
        
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var newButton = $("<button>");
        // Adds a class of cartoon to our button
        newButton.addClass("cartoonH");
        // Adds a data-attribute
        newButton.attr("data-name", cartoons[i]);
        // Provides the initial button text
        newButton.text(cartoons[i]);
        // Adds the button to the buttons-view div
        $("#buttons-view").append(newButton);

    };

    // This function handles events when the add cartoon button is clicked
    function addCartoon(event) {

        // This prevents page refreshing which could cause adverse consequences
        event.preventDefault();

        // These two lines of code will grab the input from the textbox and then clear it
        var newCartoon = $("#cartoon-input").val().trim();
        $("#cartoon-input").val("");

        // This only creates a button if the input is not blank
        if (newCartoon != "") {

            // The cartoon from the textbox is then added to our array
            cartoons.push(newCartoon);

            // Calls function which will add a new button
            renderNewButton(cartoons.length-1);
        }
    };   

    // This function displays the cartoon gifs
    function displayCartoonInfo() {

        // This clears the existing gifs
        $("#cartoons-view").empty();

        //  Since this is a new cartoon, the gifcount is reset to its base value
        gifCount = 10;

        //This gets the cartoon name from the button clicked
        currentCartoon = $(this).attr("data-name");

        // This creates the url query
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            currentCartoon + "&api_key=Qu7033MRHd7mBcNjAx9xBljKsfCMGNRR&limit=10";
            //currentCartoon + "&api_key=dc6zaTOxFJmzC&limit=10";

        
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {

            var results = response.data;

            display(results);
            
        });
    };

    // This allows toggling between still and animate for each gif
    function animate() {

        var state = $(this).attr("data-state");

        if (state == "still") {
            var imageJ = $(this).attr("data-animate");
            $(this).attr("src", imageJ);
            $(this).attr("data-state", "animate");
        }
        else if (state == "animate") {
            var imageJ = $(this).attr("data-still");
            $(this).attr("src", imageJ);
            $(this).attr("data-state", "still");
        }

    };

    // This function displays more gifs of the current cartoon
    function displayMoreGifs(event) {

        // This prevents page refreshing which could cause adverse consequences
        event.preventDefault();
        
         if (currentCartoon == "") {
             alert("You must first select a gif in order to get more of those gifs!");
         }
         else {
            // Sets gifCount to get 10 more gifs
            gifCount = gifCount + 10;
            
            // This creates the url query
            var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
                currentCartoon + "&api_key=dc6zaTOxFJmzC&limit=" + gifCount.toString();

            $.ajax({
                url: queryURL,
                method: "GET"
            })
            .then(function(response) {

                var results = response.data;

                display(results);
                
            });
        }
    };

    // This function displays the results of an ajax call
    function display (results){

        var displayedGifCount = gifCount - 10;

        for (var i = displayedGifCount; i < results.length; i++) {

            var gifdiv = $("<div>");

            var cartoonTitle = $("<h5>").text("Title: " + results[i].title);
        
            var cartoonRating = $("<h5>").text("Rating: " + results[i].rating);

            var cartoonImage = $("<img>");
            cartoonImage.attr("src", results[i].images.fixed_height_still.url);
            cartoonImage.attr("data-still", results[i].images.fixed_height_still.url);
            cartoonImage.attr("data-animate", results[i].images.fixed_height.url);
            cartoonImage.attr("data-state", "still");
            cartoonImage.attr("class", "gif");

            gifdiv.append(cartoonTitle);
            gifdiv.append(cartoonRating);
            gifdiv.append(cartoonImage);

            $("#cartoons-view").append(gifdiv);
        }

    };

})