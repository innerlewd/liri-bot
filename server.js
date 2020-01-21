require("dotenv").config();

var keys = require("./control.js");
var bit = keys.bit.api_id;
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var omdbKey = keys.omdb.api_key;
var request = require('request');
var fs = require('fs');


const a = process.argv[2];
const b = process.argv[3];

switch (a) {
    case ('concert-this'):
        if (b) {
            concerts(b);
        } else {
            concerts('Drake');
        }
        break;
    case ('spotify-this-song'):
        if (b) {
            spotifyThisSong(b);
        } else {
            spotifyThisSong('Controlla');
        }
        break;
    case ('movie-this'):
        if (b) {
            omdb(b);
        } else {
            omdb("The Matrix");
        }
        break;
    case ('do'):
        doThing();
        break;
    default:
        console.log('Try again');
};
function concerts(artist) {
    var bitURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + bit;

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

function doThing() {
    fs.readFile('info.txt', "utf8", function (error, data) {
        var txt = data.split(',');

        spotifyThisSong(txt[1]);
    });
}