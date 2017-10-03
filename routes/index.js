var express = require('express');
var router = express.Router();
var parser = require('./../libs/parser');
var downloader = require('./../libs/downloader');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
	res.render('test', { title: 'Download movie demo' });
});

router.post('/find', function(req, res, next) {
	var start = req.body.start ? req.body.start : 0;

	parser(start, req.body.film, (data) => {
		// res.send(JSON.stringify({err:null, res: data}));
		// res.status('200').send({
		// 	title: 'Search results',
		// 	films: data
		// });
		res.render('results', {
			title: 'Search results',
			films: data
		});
	});
});

// router.get('/results', function(req, res, next) {
// 	res.render('results', {
// 		title: 'Search results',
// 		films: ['1', '2', '3']
// 	});
// });

router.post('/download', function(req, res, next) {
	var magnet = req.body.magnet;

	console.log(magnet);
	downloader(magnet);
});

router.get('/watch', function(req, res, next) {
	res.render('watch', { title: 'Watch movie online' });
});

module.exports = router;
