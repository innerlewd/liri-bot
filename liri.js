require("dotenv").config();

var keys = require("./keys.js");
var bit = keys.bit.api_id;
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var omdbKey = keys.omdb.api_key;
var request = require('request');
var fs = require('fs');
var axios = require('axios')


const userInput = process.argv[2];
const userQuery = process.argv.slice(3).join("-");

function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "concert-this":
            concerts();
            break;
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-this":
            omdb();
            break;
        case "do-this":
            doThis(userQuery);
            break;
        default:
            console.log("idk")
            break;
    }
}
userCommand(userInput, userQuery)

function concerts(artist) {
    var bitURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(bitURL, function (error, response) {
        if (!error && response.statusCode == 200) {
            //   var body = JSON.parse(body);

            console.log(response);


        } else {
            console.log('Error occurred.')
        }

    });

}




function spotifyThisSong(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("Artist: " + songData.artists[0].name);
                console.log("Song: " + songData.name);
                console.log("Preview URL: " + songData.preview_url);
                console.log("Album: " + songData.album.name);
                console.log("-----------------------");
            }
        } else {
            console.log('Error occurred.');
        }
    });
}

function omdb(movie) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&apikey=' + omdbKey + '&plot=short&tomatoes=true';

    request(omdbURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);

        } else {
            console.log('Error occurred.')
        }
        
    });

}

function doThis() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        let dataArr = data.split(",")

        userInput = dataArr[0]
        userQuery=dataArr[1]

        userCommand(userInput, userQuery)
    });
}