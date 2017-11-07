var express = require('express');
var router = express.Router();
var parser = require('./../libs/parser');
var movieDownloader = require('./../libs/movieDownloader');
var subtitlesDownloader = require('./../libs/subtitlesDownloader');
var async = require('async');
var fs = require('fs-extra');


/* GET home page. */

    // /watch/<int:imdb_id>/<string:title>/<string:magnet_720>/<string:magnet_1080>
router.get('/watch/:id/:title/:magnet720/:magnet1080', function(req, res, next) {
    var upload = {
		id			: req.param('id'),
		title		: req.param('title'),
		magnetLow	: req.param('magnet720'),
		magnetHigh	: req.param('magnet1080')
    };

    //movie

    var magnets = new Array();  // input array, consists of magnet links
    var names   = new Array();  // array of file names
    var paths   = new Array();  // array consists of links to videos
    var downloaded = false;

    // magnets.push(upload.magnetLow); // 720p
    // magnets.push(upload.magnetHigh); // 1080p

    magnets.push(upload.magnetLow); // 720p
    magnets.push(upload.magnetHigh); // 1080p

    names.push(upload.title + '720p.mp4');
    names.push(upload.title + '1080p.mp4');

    if (fs.existsSync('public/videos/' + names[0])) {
        downloaded = true;
        // console.log('Downloaded status #1: ' + downloaded);
        if (fs.existsSync('public/videos/' + names[1])) {
            downloaded = true;
            // console.log('Downloaded status #2: ' + downloaded);
        }
    }

    // console.log('Downloaded status #3: ' + downloaded);

    for (var i = 0; i < 2; i++) {
        movieDownloader(magnets[i], names[i]);
        paths.push('public/videos/' + names[i]);
    }

    // function myFunc() {
    //     console.log('timeout'); // output array: [0] is 720p video, [1] is 1080p video
    // }
    //
    // setTimeout(myFunc, 1000);

    // sub

    var OS = require('opensubtitles-api');

    var OpenSubtitles = new OS({
        useragent:'OSTestUserAgentTemp',
        username: 'hypertube42',
        password: '111111',
        ssl: true
    });


    OpenSubtitles.login()
        .then(res => {
            console.log(res.token);
            console.log(res.userinfo);
        })
        .catch(err => {
            console.log(err);
        });

    var out = new Array();   // THAT IS MANDATORY PARAMETER FOR A FUNCTION
    // var imdb_id = '1253863'; // THAT IS MANDATORY PARAMETER FOR A FUNCTION

    OpenSubtitles.search({
        sublanguageid: 'eng, rus',       // Can be an array.join, 'all', or be omitted.
        //   is included.
        limit: '1',                 // Can be 'best', 'all' or an
                                    // arbitrary nb. Defaults to 'best'
        imdbid: upload.id          // Value from function parameter
    }).then(
        subtitles => {
        // an array of objects, no duplicates (ordered by
        // matching + uploader, with total downloads as fallback)

        // console.log("##### SUBTITLES GO HERE #####");
        console.log(subtitles);
        if (!subtitles.en) {
            res.send({
                downloaded   : downloaded,
                movie_url    : paths,
                subtitles_url: []
            });
        }
        // console.log("######### DOWNLOAD SUBTITLES #########");
        subtitlesDownloader(subtitles)
            .then(
                arr => {
                    if (arr[0])
                        out.push(arr[0] + '.vtt');
                    if (arr[1])
                        out.push(arr[1] + '.vtt');
                    console.log(out);
                    res.send({
                        downloaded   : downloaded,
                        movie_url    : paths,
                        subtitles_url: out
                    });
                });
        });

    // setTimeout(() => {
    //     res.send({
    //         // movie_url: paths,
    //         subtitles_url: arr
    //     });
    // }, 1000);

    // res.send(upload);
});




router.get('/search/:searchword/:start/:end', function(req, res, next) {
    var search = {
        word        : req.param('searchword') == 'null' ? '' : req.param('searchword'),
        start		: req.param('start'),
        end 		: req.param('end')
    };
    parser(search.start, search.word, (data) => {
        res.send({err:null, res: data});
    });
});


router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post('/find', function(req, res, next) {
	var start = req.body.start ? req.body.start : 0;
	parser(start, req.body.film, (data) => {
		res.send({err:null, res: data});
	});
});


module.exports = router;
