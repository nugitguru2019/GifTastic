$(document).ready(function() {


    /* Initial Variables */

    const movies = ['American Hustle', 'Pulp Fiction', 'Forest Gump', 'The Favourite'];

    const faves = [];

    let faveCount = 0;

    let faveDivFilled = false;



    /* HTML Variables */

    const btnDisplay = $('#buttonDisplay');

    const gifDispley = $('#gifDisplay');

    const submitForm = $('#submitForm');

    const submitField = $('#submitField');

    const submitBtn = $('#submitBtn');

    const faveDiv = $('<div id="faveDiv">');

    const faveListDiv = $('<div id="faveListDiv">');

    const faveTitle = $('<h3>').text('Favorites');



    /* An object containing all the functions of the project */

    const giftastic = {



        /* Loops through the movies array, builds a button for each movie in the array, and appends it to the movie-button <div>, with a click event dynamically attached. */

        initialBtns: function(arr) {

            for(i = 0; i < arr.length; i++) {

                const btn = $('<button>').addClass('movieBtn').attr('data-name', arr[i]).text(arr[i]).appendTo(btnDisplay).click(giftastic.gifsPopulate);

            }

        },



        /* Adds a new movie title, as a string, to the movies array, grabbing that string from the page's submit field. It also affixes the string to a new button in the Movie Button <div>. It's bound at the bottom of the file to the click event for the page's submit button. */

        btnPopulate: function() {

            /* Prevents default refresh action of submit button when it's clicked. */

            event.preventDefault();

            /* The string value pulled from the submit field is saved as a variable. */

            const movieTitle = submitField.val().trim();

            /* Checks to make sure the title submission isn't blank and isn't already included in the movies array. */

            if (movieTitle.length > 0 && !movies.includes(movieTitle)) {

                /* Submit field is cleared. */

                submitField.val('');

                /* The movie-button <div> is cleared of elements. */

                btnDisplay.empty();

                /* The new title is pushed to the movies array. */

                movies.push(movieTitle);

                /* The initialBtns() function is called with the updated array passed in, to create an updated series of buttons in the movie-button <div>. */

                giftastic.initialBtns(movies);

            }

        },



        /* Adds 10 GIFs to the display area, called from the GIPHY API, based on the string pulled from the data-name attribute tied to each movie button. In the giftastic.initialBtns() function above, this function is bound to each movie button as a click event when each button is created. */

        gifsPopulate: function() {



            /* Variables saved to eventually be concatenated into a full queryURL variable. The movieName variable pulls its string from the data-name attribute of the movie button that's clicked. */

            const APIKey = 'M4wL5tep7b6nAgcKcwYmhtrIKtloYfT7';

            const movieName = $(this).attr('data-name');

            const queryURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + APIKey + '&q=' + movieName + ' movie&limit=10&offset=0&rating=R&lang=en';



            /* A GET call is made to the GIPHY API, using the query URL created above. */

            $.get(queryURL, function(response) {



                /* An array of results from the GET call is saved to a variable. */

                const results = response.data;

                /* A new <div> is created to store the GIFs and the cards they're created in. */

                const newDiv = $('<div>').addClass('gifContainer');



                /* Loops through the array of results from the GET call and, for each result, builds the elements for a new GIF card. */

                for(i = 0; i < results.length; i++) {

                    const gifDiv = $('<div>').addClass('gifDiv');

                    const gifRating = $('<p>').addClass('gifP').text('Rating: ' + results[i].rating.toUpperCase());

                    const faveP = $('<p class="faveStar"> Favorite</p>');



                    /* Variables are created to search through the Favorites <div> to test whether a copy of the GIF card already exists there, and a third variable is declared but not defined. It will be defined just a few lines down in an if/else statement. */

                    const HTMLToSearchFor = results[i].images.original_still.url;

                    const faveMatch = faveListDiv.find('img[data-still="' + HTMLToSearchFor + '"]');

                    let faveStar;



                    /* Uses the faveMatch variable above to test whether the GIF already exists in the Favorites <div>. I borrowed from this link to figure out a way to check whether an element already exists in a <div>: http://www.mkyong.com/jquery/how-to-check-if-an-element-is-exists-in-jquery/ */

                    if(faveMatch.length > 0) {

                        faveStar = $('<i>').addClass('fas fa-star').click(giftastic.fave);

                    } else {

                        faveStar = $('<i>').addClass('far fa-star').click(giftastic.fave);

                    }



                    /* A new GIF image element is saved as a variable. */

                    const newImg = $('<img>').attr('src', results[i].images.original_still.url).attr('data-still', results[i].images.original_still.url).attr('data-animate', results[i].images.original.url).attr('data-state', 'still').addClass('movieGIF').click(giftastic.imgPausePlay);



                    /* The newly created elements that will make up each GIF card are prepended and appended to each other in the correct way. */

                    faveStar.prependTo(faveP);

                    newImg.appendTo(gifDiv);

                    gifRating.appendTo(gifDiv);

                    faveP.appendTo(gifDiv);

                    gifDiv.appendTo(newDiv);

                }



                /* The new <div> containing the new GIFs is prepended to the main display <div>. */

                newDiv.prependTo(gifDispley);

            })

        },



        /* This function is called to animate or pause each GIF that's created. It's bound dynamically to each GIF as each is put into an <img> element in the function above. */

        imgPausePlay: function() {



            /* The 'still' or 'animate' state of each GIF is saved in a variable. */

            const state = $(this).attr('data-state')

            if(state === 'still') {



                /* If the GIF's status is "still," its image source is changed to the "data-animate" URL and its state is updated to "animate." */

                $(this).attr('src', $(this).attr('data-animate'));

                $(this).attr('data-state', 'animate');

            } else {



                /* If the GIF's status is "animate," its image source is changed to the "data-still" URL and its state is updated to "still." */

                $(this).attr('src', $(this).attr('data-still'));

                $(this).attr('data-state', 'still');

            }

        },



        /* This function is dynamically bound to each fave star in each GIF card as each card is created. It changes the state of the star from empty to solid and back, and it puts a copy of the solid-starred GIF card in the Favorites <div> or removes it from the Favorites <div> if it's already solid and being changed back to empty. */

        fave: function() {



            /* Checks whether the Favorites <div> is open and contains elements */

            if(!faveDivFilled) {



                /* If it's not open, then clicking on an empty star appends the Favorites <div> and its component parts to the base of the submit form area */

                faveTitle.appendTo(faveDiv);

                faveListDiv.appendTo(faveDiv);

                faveDiv.appendTo(submitForm);



                /* The class of the clicked star is changed to switch it from empty to solid. If there are copies of the favorited GIF in the main display area (from repeat searches), the stars tied to all of them are turned to solid. */

                $(this).removeClass('far').addClass('fas');

                const htmlMatch = $(this).parent().siblings('img').attr('data-still');

                const faveStarMatch = $('#gifDisplay').find('img[data-still="' + htmlMatch + '"]');

                faveStarMatch.parent().find('i').removeClass('far').addClass('fas');



                /* A clone is created of the GIF card that the clicked star is in. The clone is appended to the Favorites <div>. Learned about ".clone(true)" from this link: https://stackoverflow.com/questions/18815211/click-action-from-cloned-element-does-not-work */

                $(this).parent().parent().clone(true).addClass('clone').removeClass('gifDiv').appendTo(faveListDiv);



                /* Stores the key data of the GIF tied to the clicked star into the faves array as values of an object that gets pushed to the array. */

                newFave = {};

                newFave.dataStill = $(this).parent().siblings('img').attr('data-still');

                newFave.dataAnimate = $(this).parent().siblings('img').attr('data-animate')

                newFave.rating = $(this).parent().siblings('p').text().substring(8);

                faves.push(newFave);



                /* Clears the old stringified faves array and stores the new one in local storage. */

                localStorage.removeItem('faves');

                localStorage.setItem('faves', JSON.stringify(faves));



                /* The filled status of the Favorites <div> is changed to true. */

                faveDivFilled = true;



                /* Ups the faveCount by one for the new card added to the Favorites <div>. */

                faveCount++;

            } else {



                /* If the Favorites <div> is already open but a new empty star is clicked, this appends the GIF card tied to the new star to the Favorites <div> and changes the star to a solid one. If there are copies of the favorited GIF in the main display area (from repeat searches), the stars tied to all of them are turned to solid. */

                if($(this).hasClass('far')) {

                    $(this).removeClass('far').addClass('fas');

                    const htmlMatch = $(this).parent().siblings('img').attr('data-still');

                    const faveStarMatch = $('#gifDisplay').find('img[data-still="' + htmlMatch + '"]');

                    faveStarMatch.parent().find('i').removeClass('far').addClass('fas');

                    $(this).parent().parent().clone(true).addClass('clone').removeClass('gifDiv').appendTo(faveListDiv);



                    newFave = {};

                    newFave.dataStill = $(this).parent().siblings('img').attr('data-still');

                    newFave.dataAnimate = $(this).parent().siblings('img').attr('data-animate')

                    newFave.rating = $(this).parent().siblings('p').text().substring(8);

                    faves.push(newFave);



                    localStorage.removeItem('faves');

                    localStorage.setItem('faves', JSON.stringify(faves));



                    faveCount++

                } else {



                    /* If a solid star is clicked on, either in the display area or in the Favorites <div>, the card tied to that star is removed from the Favorites <div>, and the star connected the copy of the card in the main display <div> is changed back to an empty one. */

                    if($(this).hasClass('fas')) {



                        /* Saved variables help find the copies of the GIF card in both the Favorites <div> and the main display <div>. */

                        const htmlMatch = $(this).parent().siblings('img').attr('data-still');

                        const faveMatch = faveListDiv.find('img[data-still="' + htmlMatch + '"]');

                        const faveStarMatch = $('#gifDisplay').find('img[data-still="' + htmlMatch + '"]');



                        /* The copy of the GIF card in the Favorites <div> is removed, and the class of the star in the copy of the GIF card in the main display <div> is changed so that it becomes an empty star. */

                        faveMatch.parent().detach();

                        faveStarMatch.parent().find('i').removeClass('fas').addClass('far');



                        /* Saves the appropriate index number as a variable so that the appropriate object in the faves array can be spliced out of the faves array. Borrowed some ideas from this Stack Overflow answer for finding the index of an object in an array: https://stackoverflow.com/questions/15997879/get-the-index-of-the-object-inside-an-array-matching-a-condition */

                        const faveRemoveIndex = faves.findIndex(function(obj) {

                            return obj.dataStill === htmlMatch;

                        });

                        faves.splice(faveRemoveIndex, 1)



                        localStorage.removeItem('faves');

                        localStorage.setItem('faves', JSON.stringify(faves));



                        /* Reduces the faveCount by one for the GIF card removed from the Favorites <div> */

                        faveCount--



                        /* If the faveCount gets back down to zero, the Favorites <div> is closed and its status is changed back to unfilled. */

                        if(faveCount === 0) {

                            faveDiv.detach();

                            faveDivFilled = false;

                        }

                    }

                }

            }

        }

    }



    /* Parses the recent faves from a saved string back into an array of objects and stores it in a variable when the page first loads. */

    const recentFaves = JSON.parse(localStorage.getItem('faves'));



    /* Checks if the recentFaves array exists, then checks whether it's empty. */

    if(recentFaves !== null) {

        if(recentFaves.length > 0) {



            /* If the recentFaves array isn't empty, the Favorites <div> and its component parts are appended to the submit form area. */

            faveTitle.appendTo(faveDiv);

            faveListDiv.appendTo(faveDiv);

            faveDiv.appendTo(submitForm);

            faveDivFilled = true;



            /* Loops through the contents of each object in the array and uses those contents to build cards one at a time containing favorited GIFs. Those cards are then appended to a <div> inside the Favorites <div> */

            for(i = 0; i < recentFaves.length; i++) {



                /* Variables are created for the various elements that will make up each of the saved favorite cards */

                const faveDiv = $('<div>').addClass('clone');

                const faveRating = $('<p>').addClass('gifP').text('Rating: ' + recentFaves[i].rating.toUpperCase());

                const faveP = $('<p class="faveStar"> Favorite</p>');

                const faveStar = $('<i>').addClass('fas fa-star').click(giftastic.fave);

                const newImg = $('<img>').attr('src', recentFaves[i].dataStill).attr('data-still', recentFaves[i].dataStill).attr('data-animate', recentFaves[i].dataAnimate).attr('data-state', 'still').addClass('movieGIF').click(giftastic.imgPausePlay);



                /* The newly created elements that will make up the saved favorite cards are prepended and appended to each other in the correct way. */

                faveStar.prependTo(faveP);

                newImg.appendTo(faveDiv);

                faveRating.appendTo(faveDiv);

                faveP.appendTo(faveDiv);

                faveDiv.appendTo(faveListDiv);



                /* Re-stores the key data of each card into the faves array as values of an object that gets pushed to the array. */

                newFave = {};

                newFave.dataStill = recentFaves[i].dataStill;

                newFave.dataAnimate = recentFaves[i].dataAnimate;

                newFave.rating = recentFaves[i].rating;

                faves.push(newFave);



                /* Clears the old stringified faves array and stores the new one in local storage. */

                localStorage.removeItem('faves');

                localStorage.setItem('faves', JSON.stringify(faves));



                /* Ups the faveCount variable for each fave being pulled out of local storage and added to the Favorites area, to keep the count accurate. */

                faveCount++;

            }

        }

    }



    /* Binds the btnPopulate function to the submit button. */

    submitBtn.click(giftastic.btnPopulate);



    /* Calls the initialBtns function the first time through the code to populate the initial buttons, based on the initial titles in the movies array. */

    giftastic.initialBtns(movies);

});