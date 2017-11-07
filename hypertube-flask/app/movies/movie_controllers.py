from . import movies_blueprint
from .movie_model import Movie
from flask import jsonify, request
from app import db


@movies_blueprint.route('/add', methods=['POST'])
def add_movie():
    movie = Movie()
    movie.import_data(request.json)
    db.session.add(movie)
    db.session.commit()
    return jsonify({}), 201, {'Location': movie.get_self_url()}


@movies_blueprint.route('/get_one/<int:id>')
def get_one(id):
    return jsonify(Movie.query.get_or_404(id).get_search_item())


@movies_blueprint.route('/search/<string:searchword>/<int:start>/<int:stop>')
def search_word(searchword, start, stop):
    all = [m.get_search_item() for m in Movie.query.all()]
    return jsonify({'search_results': all[start:stop]})


@movies_blueprint.route('/search/<int:start>/<int:stop>')
def search(start, stop):
    all = [m.get_search_item() for m in Movie.query.all()]
    return jsonify({'search_results': all[start:stop]})


@movies_blueprint.route('/watch/<int:imdb_id>/<string:title>/<string:magnet_720>/<string:magnet_1080>')
def watch(imdb_id, title, magnet_720, magnet_1080):
    print('imdb_id: ' + str(imdb_id))
    print('title: ' + title)
    print('magnet_720: ' + magnet_720)
    print('magnet_1080: ' + magnet_1080)
    movies = ['/static/video/Cult.Of.Chucky.2017.720p.BluRay.x264-[YTS.AG].mp4',
              '/static/video/Cult.Of.Chucky.2017.1080p.BluRay.x264-[YTS.AG].mp4']
    subtitles = []
    return jsonify({'movie_url': movies, 'subtitles_url': subtitles}), 200

