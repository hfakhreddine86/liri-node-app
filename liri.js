// Reading keys from keys.js and storing in variable
var keyList = require("./keys.js");

// Package Requests
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");

//  Pulling tweets from dummy twitter and displaying it in console
var client = new Twitter(keyList);

// Take in specific command
var action = process.argv[2];

// Hold the song name
var song = process.argv[3];

// Switch case to run specific functions
switch (action) {
    case "my-tweets":
        tweets();
        break;

    case "spotify-this-song":
        spotify(song);
        break;

    case "movie-this":
        getMovie();
        break;

    case "do-what-it-says":
        doThis();
        break;

    default:
        console.log('Incorrect command!');
        break;
}

// Function to pull tweets from Twitter
function tweets() {

    var params = {
        screen_name: 'nGiNeLeCtRiC'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("\n=================================================");
                console.log("Creation Date: " + tweets[i].created_at);
                console.log("\n=================================================");
                console.log("Tweet: " + tweets[i].text);
            }
        } else {
            console.log(error);
        }
    });
}

// Spotify Function
function spotify(song) {

    // pulling the data about the song and displaying it in console
    var spotify = new Spotify({
        id: "45e2b37138de4e858e457168edd7584e",
        secret: "073901c2915a474fbcdd79a99784a140"
    });

    if (song == null) {
        song = "Shape of You";
    }

    spotify.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("\n=================================================");
        console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
        console.log("\n=================================================");
        console.log("Song: " + data.tracks.items[0].name);
        console.log("\n=================================================");
        console.log("Spotify Link: " + data.tracks.items[0].external_urls.spotify);
        console.log("\n=================================================");
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}

// OMDB function
function getMovie() {

    // Store the movie name
    var movieName = process.argv[3];

    // Request to get the OMDB API with movieName
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function (error, response, body) {

        if (!movieName) {
            console.log("If you haven't watched Mr. Nobody, then you should: <http://www.imdb.com/title/tt0485947/>");
            console.log("It's on Netflix!");
        }
        // If the request is successful
        else if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover different data
            console.log("\n=================================================");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("\n=================================================");
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("\n=================================================");
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("\n=================================================");
            console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
            console.log("\n=================================================");
            console.log("Country: " + JSON.parse(body).Country);
            console.log("\n=================================================");
            console.log("Language: " + JSON.parse(body).Language);
            console.log("\n=================================================");
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("\n=================================================");
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}

// Function to grab song from random.txt file and use Spotify function to output the data
function doThis() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(',');
            if (dataArr[0] === 'spotify-this-song') {
                spotify(dataArr[1]);
            }
        }
    });
}