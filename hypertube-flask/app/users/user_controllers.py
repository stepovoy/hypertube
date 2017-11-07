from flask import jsonify, request, abort, g
from . import users_blueprint
from .user_model import User
from .comment_model import Comment
from .watched_movie_model import WatchedMovie
from app import db
from werkzeug.security import check_password_hash
import jwt
from functools import wraps


def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorisation')
        try:
            g.user_data = User.decode_token(token)
        except jwt.exceptions.DecodeError:
            abort(403)
        return f(*args, **kwargs)
    return decorated_function


@users_blueprint.route('/oauth42', methods=['POST'])
def oauth42():
    code = request.json['code']
    redirect_uri = request.json['redirect_uri']
    token_42 = User.get42_token(code, redirect_uri)
    user42 = User.get42_user(token_42)
    data = dict()
    data['email'] = user42['email']
    data['user42_id'] = user42['campus_users'][0]['user_id']
    user = User.get_user_by_42_id_or_none(data['user42_id'])
    if user is None:
        user = User.get_user_by_email_or_none(data['email'])
        if user is not None:
            token = user.get_token()
            return jsonify({'token': token}), 200
        data['login'] = user42['login']
        data['first_name'] = user42['first_name']
        data['last_name'] = user42['last_name']
        image_url = user42['image_url']
        data['passwd'] = User.generate_passwd()
        data['login'] = User.generate_unique_login(data['login'])
        user = User()
        user.import_data(data)
        db.session.add(user)
        db.session.flush()
        user.create_userfolder()
        user.download_save_42_photo(image_url)
        user.activated = 1
        db.session.commit()
        user.send_42_registration_email(data['passwd'])
    token = user.get_token()
    return jsonify({'token': token}), 200


@users_blueprint.route('/oauth-google', methods=['POST'])
def oauth_google():
    code = request.json['code']
    redirect_uri = request.json['redirect_uri']
    token = User.get_google_token(code, redirect_uri)
    google_user = User.get_google_user(token)
    data = dict()
    data['google_user_id'] = google_user['id']
    user = User.get_user_by_google_id_or_none(data['google_user_id'])
    if user is None:
        data['email'] = google_user['email']
        user = User.get_user_by_email_or_none(data['email'])
        if user is not None:
            token = user.get_token()
            return jsonify({'token': token}), 200
        data['login'] = google_user['name']
        data['first_name'] = google_user['name']
        data['last_name'] = google_user['family_name']
        image_url = google_user['picture']
        data['passwd'] = User.generate_passwd()
        data['login'] = User.generate_unique_login(data['login'])
        user = User()
        user.import_data(data)
        db.session.add(user)
        db.session.flush()
        user.create_userfolder()
        user.download_save_42_photo(image_url)
        user.activated = 1
        db.session.commit()
        user.send_42_registration_email(data['passwd'])
    token = user.get_token()
    return jsonify({'token': token}), 200
    

@users_blueprint.route('/reset', methods=['POST'])
def reset_email():
    data = request.json
    if 'email' not in data:
        abort(400)
    user = User.get_user_by_email_or_none(data['email'])
    if user is None or user.activated == 0:
        abort(400)
    lang = user.language
    User.send_reset_email(data['email'], lang)
    db.session.commit()
    return jsonify({}), 200


@users_blueprint.route('/reset/<string:email>', methods=['PATCH'])
def set_new_passwd(email):
    user = User.query.filter_by(email=email).first()
    if user is None:
        abort(404)
    if user.registration_token != request.json['token']:
        abort(400)
    data = dict()
    data['passwd'] = request.json['passwd']
    user.modify_data(data)
    db.session.commit()
    token = user.get_token()
    return jsonify({'token': token}), 200
    

@users_blueprint.route('/auth', methods=['POST'])
def auth():
    data = request.json
    if 'login' and 'passwd' not in data:
        abort(400)
    user = User.query.filter_by(login=data['login']).first()
    if user is None:
        user = User.query.filter_by(email=data['login']).first()
    if user is None:
        abort(400)
    if not check_password_hash(user.passwd, data['passwd']):
        abort(400)
    if user.activated == 0:
        abort(401)
    token = user.get_token()
    return jsonify({'token': token}), 200


@users_blueprint.route('/language/<int:user_id>', methods=['PATCH'])
def set_language(user_id):
    user = User.query.get_or_404(user_id)
    if not request.json:
        abort(400)
    params = request.json
    if 'language' not in params:
        abort(400)
    if params['language'] != 'en' and params['language'] != 'ru':
        abort(400)
    user.language = request.json['language']
    db.session.commit()
    return jsonify({})


@users_blueprint.route('/language/<int:user_id>', methods=['GET'])
def get_language(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({'language': user.language})


@users_blueprint.route('/confirm_email/<string:login>/<string:token>', methods=['GET'])
def confirm_email(login, token):
    user = User.query.filter_by(login=login, registration_token=token).first()
    if user is None:
        return jsonify({'confirmed': False}), 200
    user.activated = 1
    db.session.commit()
    return jsonify({'confirmed': True}), 200


@users_blueprint.route('/user', methods=['POST'])
def add_user():
    user = User()
    user.import_data(request.json)
    if user.exists():
        abort(409)
    db.session.add(user)
    db.session.flush()
    try:
        user.create_userfolder()
    except FileExistsError:
        abort(409)
    user.save_img()
    user.send_confirm_email()
    db.session.commit()

    return jsonify({'exists': False}), 201, {'Location': user.get_url()}


@users_blueprint.route('/user_exists/<string:login>', methods=['GET'])
def user_exists(login):
    exists = False
    user = User.query.filter_by(login=login).first()
    if user:
        exists = True
    return jsonify({'user_exists': exists})


@users_blueprint.route('/email_exists/<string:email>', methods=['GET'])
def email_exists(email):
    exists = False
    user = User.query.filter_by(email=email).first()
    if user:
        exists = True
    return jsonify({'email_exists': exists})


@users_blueprint.route('/user/<int:user_id>', methods=['DELETE'])
@auth_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    user.remove_userfolder()
    db.session.delete(user)
    db.session.commit()
    return jsonify({})


@users_blueprint.route('/user/<int:user_id>', methods=['PATCH'])
@auth_required
def modify_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.modify_data(data)
    db.session.commit()
    token = user.get_token()
    return jsonify({'token': token})


@users_blueprint.route('/user/<int:user_id>', methods=['GET'])
@auth_required
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.export_data())


# COMMENT ROUTES


@users_blueprint.route('/comments/<int:movie_id>', methods=['GET'])
@auth_required
def get_all_comments(movie_id):
    comments = db.session.query(User, Comment). \
        filter(Comment.user_id == User.user_id). \
        filter(Comment.movie_id == movie_id). \
        order_by(Comment.date_time.desc()).all()
    result = Comment.export_data(comments)
    return jsonify({"comments": result}), 200


@users_blueprint.route('/comments', methods=['POST'])
@auth_required
def post_comment():
    comment = Comment()
    comment.import_data(request.json)
    db.session.add(comment)
    db.session.commit()
    return jsonify({}), 201


# WATCHED MOVIES ROUTES


@users_blueprint.route('/watched_movies', methods=['POST'])
@auth_required
def add_watched_movie():
    data = request.json
    watched_movie = WatchedMovie.query.filter_by(user_id=data['user_id'], movie_id=data['movie_id']).first()
    if watched_movie is None:
        watched_movie = WatchedMovie()
        watched_movie.import_data(request.json)
        db.session.add(watched_movie)
        db.session.commit()
    return jsonify({}), 201


@users_blueprint.route('/watched_movies/<int:user_id>', methods=['GET'])
@auth_required
def get_watched_movies(user_id):
    watched_movies = WatchedMovie.query.filter_by(user_id=user_id).all()
    result = [movie.export_data() for movie in watched_movies]
    return jsonify(result), 200


@users_blueprint.route('/is_watched/<int:user_id>/<int:movie_id>', methods=['GET'])
@auth_required
def is_watched(user_id, movie_id):
    movie = WatchedMovie.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    if movie is None:
        msg = 'KO'
    else:
        msg = 'OK'
    return jsonify({"is_watched": msg}), 200
