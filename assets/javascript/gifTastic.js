$(document).ready(function() {
            
    //  API_KEY Qu7033MRHd7mBcNjAx9xBljKsfCMGNRR
    
    // Initial array of cartoons
    var cartoons = ["Daffy Duck", "Wile E. Coyote", "Bugs Bunny", "Elmer Fudd",
    "Sylvester the Cat", "Tweety Bird", "Yosemite Sam", "Foghorn Leghorn"];

    var currentCartoon = "";
    var gifCount = 10;

    // Calls the renderButtons function to display the intial buttons
    renderInitialButtons();

    // Adds click event listeners to all elements with a class of "cartoonH"
    $(document).on("click", ".cartoonH", displayCartoonInfo);

    // Adds click event listeners to all elements with a class of "gif"
    $(document).on("click", ".gif", animate);

    // Adds click event listeners to all elements with a class of "gif"
    $(document).on("click", "#add-gifs", displayMoreGifs);
        
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
        // Added a data-attribute
        newButton.attr("data-name", cartoons[i]);
        // Provided the initial button text
        newButton.text(cartoons[i]);
        // Added the button to the buttons-view div
        $("#buttons-view").append(newButton);

    }

    // This function handles events when the add cartoon button is clicked
    // Should this be handled by $(document).on???
    $("#add-cartoon").on("click", function(event) {

        // This prevents page refreshing which could cause adverse consequences
        event.preventDefault();

        // These two lines of code will grab the input from the textbox and then clear it
        var newCartoon = $("#cartoon-input").val().trim();
        $("#cartoon-input").val("");

        // This only creates a button if the input is not blank
        if (newCartoon != "") {

            // The cartoon from the textbox is then added to our array
            cartoons.push(newCartoon);

            // Calling renderNewButton which will add a new button
            renderNewButton(cartoons.length-1);
        }
    });   

    // This function displays the cartoon gifs
    function displayCartoonInfo() {

        // This clears the existing gifs
        $("#cartoons-view").empty();

        gifCount = 10;

        //This gets the cartoon name from the button clicked
        currentCartoon = $(this).attr("data-name");

        // This creates the url query
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
            currentCartoon + "&api_key=dc6zaTOxFJmzC&limit=10";
        
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function(response) {

            var results = response.data;

            for (var i = 0; i < results.length; i++) {

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

    function displayMoreGifs(event) {

        // This prevents page refreshing which could cause adverse consequences
        event.preventDefault();

        // This clears the existing gifs
        // $("#cartoons-view").empty();

        
         if (currentCartoon == "") {
             alert("You must first select a gif in order to get more of those gifs!");
         }
         else {
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
            });
        }
    };

})