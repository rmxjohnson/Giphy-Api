// Homework Assignment #6 - Giphy API
// javascript/jQuery
// Rhonda Johnson

$(document).ready(function () {
    // Initial array of animals/topics
    var topics = ["DOG", "CAT", "PIG", "HORSE", "UNICORN", "GIRAFFE", "ELEPHANT", "KOALA BEAR",
        "PENGUIN", "SNAKE", "BUZZARD", "BEAR", "ALPACA"];
    var addAnimalButton = $("#add-animal");
    var animalsView = $("#animals-view");
    var buttonsView = $("#buttons-view");
    var stillFlag = "still";
    var animatedFlag = "animated";
    // max number if gifs for the request
    var maxImages = 10;
    // set initial offset for items in the response returned from the giphy api
    var currentOffset = 0;
    // initialize animal variable
    var animal = "NoValue";

    // displayAnimalInfo function re-renders the HTML to display the appropriate content
    function displayAnimalInfo() {

        // set the animal name selected by the user
        var animalCheck = $(this).attr("data-name");
        console.log("animal = " + animalCheck);
        console.log("offset = " + currentOffset);

        //clear the display of animal gifs if user did not click on the add-more button
        if (animalCheck !== "add-more") {
            animalsView.empty();
            currentOffset = 0;
            console.log("offset should reset = " + currentOffset);
            animal = animalCheck;
        }
        // check to see if an animal button had been clicked
        else {
            if (animal == "NoValue") {
                alert("INVALID - you need to select an animal before adding 10 more gifs!");
                return;
            }
        }

        // build query string
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + animal +
            "&api_key=q40OP8rMaZa0dBwabk58Odvfyt0pDQXU&limit=" + maxImages + "&offset=" + currentOffset;

        // Creating an AJAX call for the specific animal button being clicked
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {

            var imageCount;

            // determine the number of items returned by the ajax request
            var responseLength = response.data.length;

            if (responseLength == 0) {
                alert("There are no gifs for this item. \nPlease select another button.");
            }
            else {
                if (responseLength > maxImages) {
                    imageCount = maxImages;
                }
                else {
                    imageCount = responseLength;
                }

                for (var i = 0; i < imageCount; i++) {

                    // Creating a div to hold the current animal gif and rating info
                    var animalDiv = $("<div>");

                    // Retrieving the rating for the current image
                    var currentRating = (response.data[i].rating).toUpperCase();

                    // creating an element to hold the rating info
                    var ratingLabel = $("<p>")
                    ratingLabel.text("Rating: " + currentRating);

                    animalDiv.append(ratingLabel);

                    // URL for the "still" image
                    var stillImage = response.data[i].images.fixed_width_still.url;

                    //URL for the "animated" image
                    var animatedImage = response.data[i].images.fixed_width.url;

                    // Creating an element to hold the image 
                    var currentImage = $("<img>");

                    // add a class to the image
                    currentImage.addClass("animalGIF");

                    // original source is the "still" image
                    currentImage.attr("src", stillImage);

                    // store the "still" url
                    currentImage.attr("data-stillurl", stillImage);

                    // store the "animated" url
                    currentImage.attr("data-animatedurl", animatedImage);

                    // set the current state to "still"
                    currentImage.attr("data-currentStatus", stillFlag);

                    // Appending the current image to the animal div
                    animalDiv.append(currentImage);


                    // Put the entire animal after the previous animal divs
                    animalsView.append(animalDiv);

                }

                // increment the offset for the queryURL by 10 - needed when user wants 10 additional gifs
                currentOffset += 10;
            }
        });
    }

    // Function for displaying animal button data
    function renderButtons() {

        // Deleting the animal buttons prior to adding new animal buttons
        // (this is necessary otherwise you will have repeat buttons)
        buttonsView.empty();

        // Looping through the array of animals
        for (var i = 0; i < topics.length; i++) {

            // Then dynamicaly generating buttons for each animal in the array
            // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
            var animalButton = $("<button>");

            // Adding a class of animal-btn to the button
            animalButton.addClass("btn btn-info animal-btn");

            // Adding a data-attribute
            animalButton.attr("data-name", topics[i]);

            // Providing the initial button text
            animalButton.text(topics[i]);

            // Adding the button to the buttonsView div
            buttonsView.append(animalButton);
        }

        // clear the user input from the input field
        $("#animal-input").val('');
    }

    // This function handles events when the Sumbit (add-animal) button is clicked
    addAnimalButton.on("click", function (event) {
        // disable normal "SUBMIT" button behavior
        event.preventDefault();

        // get user input from the textbox
        var newAnimal = ($("#animal-input").val().trim()).toUpperCase();

        // Check for empty string
        if (newAnimal == '') {
            alert("Cannot add a blank field. \nPlease enter valid data");
        }
        else {
            // Adding animal from the textbox to the topics
            topics.push(newAnimal);
        }

        // Calling renderButtons which displays the buttons associated with the topics
        renderButtons();
    });

    // function to toggle the state of the gif  "still"-->"animated"  or "animated"-->"still"
    function changeState() {

        // get the current state of the GIF
        var status = $(this).attr("data-currentStatus");

        var newURL;

        // current status is "still"
        if (status == stillFlag) {
            // change the status from "still" to "animated"
            $(this).attr("data-currentStatus", animatedFlag);

            // change the image URL from "still" to "animated" gif
            newURL = $(this).data("animatedurl");
            $(this).attr("src", newURL);
        }

        // current status is "animated"
        else {
            // change the status from "animated" to "still"
            $(this).attr("data-currentStatus", stillFlag);

            // change the image URL from "animated" to "still" gif
            newURL = $(this).data("stillurl");
            $(this).attr("src", newURL);
        }
    }

    // Adding a click event listener to all elements with a class of "animal-btn"
    $(document).on("click", ".animal-btn", displayAnimalInfo);

    // Adding a click event listener to button with an id of "add-gifs" ; add 10 additional gifs
    $(document).on("click", "#add-gifs", displayAnimalInfo);

    // Adding a click event listener to all elements with a class of "animalGif"
    // to toggle state "still" / "animated"
    $(document).on("click", ".animalGIF", changeState);

    // Calling the renderButtons function to display the intial buttons from the hard-coded topics array
    renderButtons();

})