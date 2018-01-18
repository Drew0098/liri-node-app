require("dotenv").config();
const Twitter = require('twitter');
const spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');


const keys = require('./keys.js');


var userInput = process.argv;
var liriFunction = userInput[2];
var liriArg = '';
for (var i = 3; i < userInput.length; i++) {
	liriArg += userInput[i] + ' ';
}


function retrieveTweets() {
	let twit = new Twitter(keys.twitter);

	let parameters = {screen_name: 'web_dev_demo', count: 20};

	twit.get('statuses/user_timeline', parameters, function(error, tweets, response) {
		if (error) {
			var errorStr = 'ERROR: Retrieving user tweets -- ' + error;
				console.log(errorStr);

			return;
		} else {
			let outputStr = '------------------------\n' +
							'User Tweets:\n' + 
							'------------------------\n\n';

			for (var i = 0; i < tweets.length; i++) {
				outputStr += 'Created on: ' + tweets[i].created_at + '\n' + 
							 'Tweet content: ' + tweets[i].text + '\n' +
							 '------------------------\n';
			}
				console.log(outputStr);
		}
	});
}

function spotifySong(song) {
	let spoty = new spotify(keys.spotify);
	var search;
	if (song === '') {
		search = 'The Sign Ace Of Base';
	} else {
		search = song;
	}

	spoty.search({ type: 'track', query: search}, function(error, data) {
	    if (error) {
			var errorStr1 = 'ERROR: Retrieving Spotify track -- ' + error;
				console.log(errorStr1);
				return;
	    } else {
			var songInfo = data.tracks.items[0];
			if (!songInfo) {
				var errorStr2 = 'ERROR: No song info retrieved, please check the spelling of the song name!';

					console.log(errorStr2);
					return;
			} else {
				var outputStr = '------------------------\n' + 
								'Song Information:\n' + 
								'------------------------\n\n' + 
								'Song Name: ' + songInfo.name + '\n'+ 
								'Artist: ' + songInfo.artists[0].name + '\n' + 
								'Album: ' + songInfo.album.name + '\n' + 
								'Preview Here: ' + songInfo.preview_url + '\n';


					console.log(outputStr);
			}
	    }
	});
}

function retrieveOBDBInfo(movie) {
	var search;
	if (movie === '') {
		search = 'Mr. Nobody';
	} else {
		search = movie;
	}
	search = search.split(' ').join('+');
	console.log(search);

	var queryStr = 'http://www.omdbapi.com/?apikey=trilogy&t=' + search + '&plot=full&tomatoes=true';

	request(queryStr, function (error, response, body) {
		if ( error || (response.statusCode !== 200) ) {
			var errorStr1 = 'ERROR: Retrieving OMDB entry -- ' + error;
				console.log(errorStr1);

			return;
		} else {
			var data = JSON.parse(body);
			if (!data.Title && !data.Released && !data.imdbRating) {
				var errorStr2 = 'ERROR: No movie info retrieved, please check the spelling of the movie name!';

					console.log(errorStr2);
					return;
			} else {
		    	var outputStr = '------------------------\n' + 
								'Movie Information:\n' + 
								'------------------------\n\n' +
								'Movie Title: ' + data.Title + '\n' + 
								'Year Released: ' + data.Released + '\n' +
								'IMBD Rating: ' + data.imdbRating + '\n' +
								'Rotten Tomatoes Rating: ' + data.tomatoRating + '\n' +
								'Country Produced: ' + data.Country + '\n' +
								'Language: ' + data.Language + '\n' +
								'Plot: ' + data.Plot + '\n' +
								'Actors: ' + data.Actors + '\n';


					console.log(outputStr);
			}
		}
	});
}

function doAsYerTold() {
	fs.readFile('./random.txt', 'utf8', function (error, data) {
		if (error) {
			console.log('ERROR: Reading random.txt -- ' + error);
			return;
		} else {
			var cmdString = data.split(',');
			var command = cmdString[0].trim();
			var param = cmdString[1].trim();

			switch(command) {
				case 'my-tweets':
					retrieveTweets(); 
					break;

				case 'spotify-this-song':
					spotifySong(param);
					break;

				case 'movie-this':
					retrieveOBDBInfo(param);
					break;
			}
		}
	});
}

if (liriFunction === 'my-tweets') {
	retrieveTweets(); 

} else if (liriFunction === `spotify-this-song`) {
	spotifySong(liriArg);

} else if (liriFunction === `movie-this`) {
	retrieveOBDBInfo(liriArg);

} else if (liriFunction ===  `do-what-it-says`) {
	doAsYerTold();

}