require("dotenv").config();

var keys = require("./keys.js");
var bit = keys.bit.api_id;
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var omdbKey = keys.omdb.api_key;
var request = require('request');
var fs = require('fs');

var moment = require('moment')


let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join("-");

function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "concert-this":
            concerts();
            break;
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-this":
            movie();
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


function concerts() {
    console.log(`\n - - - - -\n\Searching for ${userQuery}'s next show.`);
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp", function 
    (error, response, body) {
        if (!error && response.statusCode === 200) {
            let userBand = JSON.parse(body);
            if (userBand.length > 0) {
                for (i = 0; i < 1; i++) {
                    console.log(`\nArtist: ${userBand[i].lineup[0]} \nVenue: ${userBand[i].venue.name}\nVenue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude}\nVenue City: ${userBand[i].venue.city}, ${userBand[i].venue.country}`)
                    let concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A")
                    console.log(`Date: ${concertDate}\n\n- - - - -`)
                }
            } else {
                console.log('concert not found!')
            }
        }
    })
}




function spotifyThisSong() {
    console.log(`\n - - - - -\n\nsearching for "${userQuery}"`);
    if (!userQuery) {
        userQuery = "controlla"
    };
    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        let spotifyArr = data.tracks.items;

        for (i = 0; i < spotifyArr.length; i++) {
            console.log(`\nArtist: ${data.tracks.items[i].album.artists[0].name} \nSong: ${data.tracks.items[i].name}\nAlbum: ${data.tracks.items[i].album.name}\nSpotify link: ${data.tracks.items[i].external_urls.spotify}\n\n - - - - -`)
        };
    });
}

function movie() {
    console.log(`\n - - - - -\n\nsearching for "${userQuery}"`);
    if (!userQuery) {
        userQuery = "the matrix";
    }
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=6963b3aa", function (error, response, body) {
        let userMovie = JSON.parse(body);
        let ratingsArr = userMovie.Ratings;
        if (undefined !== ratingsArr && ratingsArr.length > 2) {}

        if (!error && response.statusCode === 200) {
            console.log(`\nTitle: ${userMovie.Title}\nCast: ${userMovie.Actors}\nReleased: ${userMovie.Year}\nIMDb Rating: ${userMovie.imdbRating}\nRotten Tomatoes Rating: ${userMovie.Ratings[1].Value}\nCountry: ${userMovie.Country}\nLanguage: ${userMovie.Language}\nPlot: ${userMovie.Plot}\n\n- - - - -`)
        } else {
            return console.log("Error:" + error)
        };
    })
};

function doThis() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        if (error) {
            return console.log(error)
        }
        let dataArr = data.split(",")

        userInput=dataArr[0]
        userQuery=dataArr[1]

        userCommand(userInput, userQuery)
    });
}