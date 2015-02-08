var _ = require('lodash'),
    koa = require('koa'),
    lastfm = require('./lastfmApi'),
    router = require('koa-router');

var app = koa();

app.use(function *(next) {
    var time = Date.now();
    yield next;
    console.log('Request processed in', Date.now() - time);
});
app.use(router(app));
app.listen(3000);
console.log('Listenting');

app.get('/tracks/:track', function *(next) {
    var time = Date.now();
    var result = yield lastfm.searchTracks(this.params.track);
    console.log('Track lookup', Date.now() - time);

    var artistTracks = result.trackmatches.track
        .map(function(track) {
            return {
                artist: track.artist,
                name: track.name
            };
        });

    time = Date.now();
    var shouts = yield artistTracks
            .map((at) => lastfm.getShouts(at.artist, at.name));
    console.log('Shout lookups', Date.now() - time);

    var shoutObjects = shouts
        .map(function(contents) {
            return {
                shouts: contents
            };
        });

    this.body = _.zip(artistTracks, shoutObjects)
        .map((zipped) => _.merge.apply(undefined, zipped));
});
