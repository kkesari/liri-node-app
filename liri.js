// npm install axios
var axios = require("axios");
//npm install dotenv
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
//npm install moment --save
var moment = require('moment');
var fs = require('fs');
var Spotify = require('node-spotify-api');

// User to provide one of these values in the command line as an argument
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says
var nodeArgs = process.argv;
var pickOption = process.argv[2];

if (pickOption === "concert-this") {
    // Logic for concert-this option to get relevant information from bandsintown API 
    // -----------------------------------------------------------------------------------------------------//    

    // console.log(" you have selected the pick option as " + pickOption);

    var artistStr = "";
    // if the user has not provided any value for the movie, default the movie to Mr.Nobody
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            artistStr = artistStr + "+" + nodeArgs[i];
        } else {
            artistStr += nodeArgs[i];

        }
    }
    if (artistStr === "" || !(artistStr)) {
        console.log(" Incorrect command. You have to provide an artist name or band name for searching results ");
    }
    else {

        // run a request with axios providing the artist name entered, in the bandsintown
        var concertUrl = "https://rest.bandsintown.com/artists/" + artistStr + "/events?app_id=codingbootcamp";
        // This line is just to help us debug against the actual URL.
        //console.log(concertUrl);
        axios.get(concertUrl).then(
            function (response) {
                console.log("There are total of " + response.data.length + " events found for the artist " + artistStr);
                for (i = 0; i < response.data.length; i++) {
                    // console.log(response);
                    console.log("---------------" + (i + 1) + " Event Data---------------------------------------");
                    console.log("Name of the venue: " + response.data[i].venue.name);
                    console.log("Venue location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + " " + response.data[i].venue.country);
                    console.log("Date of the Event: " + moment(response.data[i].venue.datetime).format("MM/DD/YYYY hh:mm:ss A"));

                }
            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
    }

} else if (pickOption === "spotify-this-song") {
    // Logic for spotify-this-song option to search using spotify search option 
    // -----------------------------------------------------------------------------------------------------//
    // var artist = process.argv[3];
    var songs = process.argv.slice(3).join(" ");
    //npm install --save node-spotify-api
    var spotify = new Spotify(keys.spotify);
    //console.log(" you have selected the pick option as " + pickOption);
    // To search in the spotify with the information provided

    if (!songs) {
        songs = "The Sign";
    }
    //Temporarily we just need one data point, so kept items[0]
    spotify.search({
        type: 'track',
        query: songs
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
        console.log("The song's name: " + data.tracks.items[0].name);
        console.log("preview link: " + data.tracks.items[0].preview_url);
        console.log("Album Name: " + data.tracks.items[0].album.name);
    });

} else if (pickOption === "movie-this") {
    // Logic for movie-this option to pull data from OMDB API 
    // -----------------------------------------------------------------------------------------------------//
    // take the user input parameter which is a movie name, pass it to our API
    // var movieName = process.argv[3];
    var movieStr = "";

    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            movieStr = movieStr + "+" + nodeArgs[i];
        } else {
            movieStr += nodeArgs[i];

        }
    }
    if (movieStr === "" || !(movieStr)) {
        movieStr = "Mr. Nobody";
    }

    // console.log(movieStr + " movieStr");
    //console.log(" you have selected the pick option as " + pickOption);
    // run a request with axios to the OMDB API with the movie specified
    var movieUrl = "http://www.omdbapi.com/?t=" + movieStr + "&y=&plot=short&apikey=trilogy";
    //console.log(movieUrl);

    axios.get(movieUrl).then(
        function (response) {
            console.log("---------------Data---------------------------------------");
            console.log("Title of the movie: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating of the movie: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value);
            console.log("Country where the movie was produced: " + response.data.Country);
            console.log("Language of the movie: " + response.data.Language);
            console.log("Plot of the movie: " + response.data.Plot);
            console.log("Actors in the movie: " + response.data.Actors);
            console.log("----------------------------------------------------------");
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
} else if (pickOption === "do-what-it-says") {
    // Logic for do-what-it-says option to read the data from random.txt and perform the steps listed 
    // -----------------------------------------------------------------------------------------------------//    
    console.log(" you have selected the pick option as " + pickOption);

    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);

    });
}
