var request = require('superagent');

var API_CONFIG = {
    'api_key': 'c88aeeba2c349cdd251b8602f1212aa0',
    'format':'json'
};

module.exports = {
    searchTracks: function searchTracks(trackName) {
        var result = new Promise(function(resolve, reject) {
            request.get('http://ws.audioscrobbler.com/2.0/?method=track.search')
                .query({
                    track: trackName,
                    limit: 10
                })
                .query(API_CONFIG)
                .end(function(res) {
                    if(res.error) {
                        reject(res.error);
                    } else {
                        resolve(res.body.results);
                    }
                });
        });

        return result;
    },
    getShouts: function getShouts(artist, track) {
        var result = new Promise(function(resolve, reject) {
            request.get('http://ws.audioscrobbler.com/2.0/?method=track.getshouts')
                .query({
                    artist: artist,
                    track: track,
                    limit: 1
                })
                .query(API_CONFIG)
                .end(function(res) {
                    if(res.error) {
                        reject(res.error);
                    } else {
                        resolve(res.body.shouts.shout);
                    }
                });
        });

        return result;
    }
};

