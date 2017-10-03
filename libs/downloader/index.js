var fs = require('fs');
var path = require('path');

var torrentStream = require('torrent-stream');

// var opensubtitlesApi = require("opensubtitles-api")
//
// const OS = require('opensubtitles-api');
//
// const OpenSubtitles = new OS({
// 	useragent:'OSTestUserAgentTemp',
// 	username: 'hypertube42',
// 	password: '111111',
// 	ssl: true
// });
//
// OpenSubtitles.login()
// 	.then(res => {
// 		console.log(res.token);
// 		console.log(res.userinfo);
// 	})
// 	.catch(err => {
// 		console.log(err);
// 	});
//
// OpenSubtitles.search({
// 	sublanguageid: 'fre',       // Can be an array.join, 'all', or be omitted.
// 	path: 'foo/bar.mp4',        // Complete path to the video file, it allows
//                                 //   to automatically calculate 'hash'.
// 	filename: 'bar.mp4',        // The video file name. Better if extension
//                                 //   is included.
// 	extensions: ['srt', 'vtt'], // Accepted extensions, defaults to 'srt'.
// 	limit: '3',                 // Can be 'best', 'all' or an
//                                 // arbitrary nb. Defaults to 'best'
// 	query: 'Charlie Chaplin',   // Text-based query, this is not recommended.
// }).then(subtitles => {
// 	// an array of objects, no duplicates (ordered by
// 	// matching + uploader, with total downloads as fallback)
//
// 	subtitles = Object {
// 		en: {
// 			downloads: "432",
// 				encoding: "ASCII",
// 				id: "192883746",
// 				lang: "en",
// 				langName: "English",
// 				score: 9,
// 				url: "http://dl.opensubtitles.org/download/subtitle_file_id",
// 				filename: "some_movie.tag.srt"
// 		}
// 		fr: {
// 			download: "221",
// 				encoding: "UTF-8",
// 				id: "1992536558",
// 				lang: "fr",
// 				langName: "French",
// 				score: 6,
// 				url: "http://dl.opensubtitles.org/download/subtitle_file_id",
// 				filename: "some_movie.tag.srt"
// 		}
// 	}
// });

var downloadMovie = (magnet) => {
    return new Promise(resolve => {
        var engine = torrentStream(magnet, {
            path: 'tmp/videos/',
        });

        var videos = 'public/videos';

        var count = 0;
        var filesNum = 0;

        engine.on('ready', function () {
            engine.files.forEach(function (file) {
                var format = file.name.split('.').pop();
                filesNum = filesNum + 1;
                // console.log('filename:', file.name);
                if (format === 'mp4' || format === 'webm' || format === 'ogg' || format === 'mkv') {
	                var stream = file.createReadStream();
                    if (!fs.existsSync(videos)){
                        console.log('public/videos directory has been created');
                        fs.mkdirSync(videos);
                    }
	                console.log('matching movie format');
                    console.log('path is the following: ' + videos + '/' + file.name)
                    stream.pipe(fs.createWriteStream(videos + '/' + file.name));
                }
                else {
                    console.log('non-supported video format or other type of file');
                }
            })
        })

        engine.on('idle', function () {
            console.log('Torrent stream is being idle now');
            count = count + 1;
            if (count === filesNum) {
                console.log('Movie has been downloaded successfully!');
                return 1;
            }
        })
    })
}



module.exports = function (magnet) {
	downloadMovie(magnet)
};
