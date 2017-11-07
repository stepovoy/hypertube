import os
from datetime import datetime
from flask import url_for, current_app, abort
from flask_mail import Message
from werkzeug.security import generate_password_hash
from PIL import Image
from io import BytesIO
import base64
import uuid
from app import db, mail
from ..exceptions import ValidationError
import jwt
import shutil
from urllib import request, parse
from json import loads
import string
import random


class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    language = db.Column(db.String(2), default='en')
    user42_id = db.Column(db.Integer)
    google_user_id = db.Column(db.Integer)
    login = db.Column(db.String(128), unique=True)
    #add unique after debug
    email = db.Column(db.String(128), unique=True)
    jwt = db.Column(db.String)
    avatar_url = db.Column(db.String(256))
    passwd = db.Column(db.String(256))
    first_name = db.Column(db.String(128))
    last_name = db.Column(db.String(128))
    registration_token = db.Column(db.String(128))
    activated = db.Column(db.Integer, default=0)
    join_date = db.Column(db.Integer, default=datetime.utcnow().timestamp())
    watched_movies = db.relationship('WatchedMovie', backref=db.backref('user', lazy='joined'), lazy='dynamic',
                                     cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref=db.backref('user', lazy='joined'), lazy='dynamic',
                               cascade='all, delete-orphan')
    
    def __init__(self):
        self.image_base64 = None
    
    def get_url(self):
        return url_for('user_controllers.get_user', user_id=self.user_id, _external=True)
    
    def export_data(self):
        return {
            'user_id': self.user_id,
            'login': self.login,
            'email': self.email,
            'avatar_url': self.avatar_url,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'join_date': self.join_date,
            'watched_movies': url_for('user_controllers.get_watched_movies', user_id=self.user_id, _external=True),
            'language': self.language
        }
    
    def import_data(self, data):
        try:
            self.login = data['login']
            self.email = data['email']
            self.first_name = data['first_name']
            self.last_name = data['last_name']
            self.passwd = generate_password_hash(data['passwd'])
            if 'avatar64' in data:
                self.image_base64 = data['avatar64']
            if 'user42_id' in data:
                self.user42_id = data['user42_id']
            if 'google_user_id' in data:
                self.google_user_id = data['google_user_id']
        except KeyError as e:
            raise ValidationError('Invalid user: missing ' + e.args[0])
    
    def modify_data(self, data):
        if 'login' in data:
            self.login = data['login']
        if 'email' in data:
            self.email = data['email']
        if 'first_name' in data:
            self.first_name = data['first_name']
        if 'last_name' in data:
            self.last_name = data['last_name']
        if 'passwd' in data and data['passwd'] is not None:
            self.passwd = generate_password_hash(data['passwd'])
        if 'avatar64' in data and data['avatar64'] is not None:
            self.delete_img_file()
            if data['avatar64'] == 'del':
                self.avatar_url = None
                return
            self.image_base64 = data['avatar64']
            self.save_img()
    
    def exists(self):
        login_exists = User.query.filter_by(login=self.login).first()
        email_exists = User.query.filter_by(email=self.email).first()
        if login_exists or email_exists:
            return True
        return False
    
    def create_userfolder(self):
        os.mkdir(os.path.join(current_app.config['UPLOAD_FOLDER'], str(self.user_id)))
        
    def remove_userfolder(self):
        shutil.rmtree(os.path.join(current_app.config['UPLOAD_FOLDER'], str(self.user_id)))
        
    def delete_img_file(self):
        del_path = str(current_app.config['APP_DIRECTORY']) + str(self.avatar_url)
        if os.path.exists(del_path):
            os.remove(del_path)
    
    def save_img(self):
        if self.image_base64 is None:
            return
        im = Image.open(BytesIO(base64.b64decode(self.image_base64.split(',')[1])))
        im_filename = str(uuid.uuid4()) + '.' + im.format
        im_dbpath = '/static/users/' + str(self.user_id) + '/' + im_filename
        im_filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], str(self.user_id), im_filename)
        im.save(im_filepath)
        self.avatar_url = im_dbpath
    
    def send_confirm_email(self):
        token = str(uuid.uuid4())
        subject = 'Hypertube email confirmation'
        if self.language == 'en':
            sender = current_app.config['NG_ADDRESS']
        else:
            sender = current_app.config['NG_ADDRESS_RU']
        recipient = self.email
        body = '''Greetings new hypertube user!
        \n\nPlease follow the link to finish registration:
        \n{0}'''.format(sender
                        + '/sign-in/?confirmed=true&token=' +
                        token +
                        '&login=' +
                        self.login)
        msg = Message(sender=sender,
                      recipients=[recipient],
                      subject=subject,
                      body=body
                      )
        self.registration_token = token
        mail.send(msg)

    @staticmethod
    def send_reset_email(email, lang):
        user = User.query.filter_by(email=email).first()
        if user is None:
            abort(404)
        token = str(uuid.uuid4())
        subject = 'Hypertube reset email'
        if lang == 'en':
            sender = current_app.config['NG_ADDRESS']
        else:
            sender = current_app.config['NG_ADDRESS_RU']
        recipient = email
        body = '''Please follow the next link to reset password:
                \n{0}'''.format(sender
                                + '/create_new_password/?token=' +
                                token +
                                '&email=' +
                                email)
        msg = Message(sender=sender,
                      recipients=[recipient],
                      subject=subject,
                      body=body
                      )
        user.registration_token = token
        mail.send(msg)
    
    def get_token(self):
        return jwt.encode(self.export_data(),
                          current_app.config['SECRET_KEY'],
                          current_app.config['JWT_ALGORITHM']).decode("utf-8")
    
    @staticmethod
    def decode_token(token):
        return jwt.decode(token,
                          current_app.config['SECRET_KEY'],
                          current_app.config['JWT_ALGORITHM'])
    
    @staticmethod
    def get42_token(code, redirect_uri):
        data = {
            'grant_type': 'authorization_code',
            'client_id': '135caaea196569df717378f2950cfb4833e1a936d8c3c4a5f56f57fbec6935a4',
            'client_secret': 'b26e81d39a962c5304b0f8642cf670eab074893794faa08285a92d3e7eaebdad',
            'redirect_uri': redirect_uri,
            'code': code,
        }
        encoded_data = parse.urlencode(data).encode()
        try:
            req = request.Request('https://api.intra.42.fr/oauth/token', data=encoded_data)
            resp = request.urlopen(req)
            response_dict = loads(resp.read().decode('utf-8'))
        except Exception as e:
            abort(401)
        return response_dict['access_token']
    
    @staticmethod
    def get42_user(token):
        try:
            req = request.Request('https://api.intra.42.fr/v2/me')
            req.add_header('Authorization', 'Bearer ' + token)
            resp = request.urlopen(req)
            response_dict = loads(resp.read().decode('utf-8'))
        except Exception as e:
            abort(401)
        return response_dict
        
    @staticmethod
    def get_user_by_email_or_none(email):
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def get_user_by_42_id_or_none(user42_id):
        return User.query.filter_by(user42_id=user42_id).first()
    
    @staticmethod
    def generate_passwd(size=8, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(size))
    
    @staticmethod
    def generate_unique_login(login):
        user = User.query.filter_by(login=login).first()
        if user is not None:
            login = login + User.generate_passwd(size=1)
            login = User.generate_unique_login(login)
        return login
    
    def download_save_42_photo(self, photo_url):
        im_filename = str(uuid.uuid4()) + '.jpg'
        im_dbpath = '/static/users/' + str(self.user_id) + '/' + im_filename
        im_filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], str(self.user_id), im_filename)
        request.urlretrieve(photo_url, im_filepath)
        self.avatar_url = im_dbpath
        
    def send_42_registration_email(self, passwd):
        token = str(uuid.uuid4())
        subject = 'Welcome to Hypertube'
        sender = current_app.config['NG_ADDRESS']
        recipient = self.email
        body = '''Greetings {0}! Welcome to Hypertube!\n
                  You can use the following login and autogenerated password to sign-in.\n\n
                  Login: {1}\n
                  Password: {2}\n'''.format(self.first_name,
                                            self.login,
                                            passwd)
        msg = Message(sender=sender,
                      recipients=[recipient],
                      subject=subject,
                      body=body
                      )
        self.registration_token = token
        mail.send(msg)

    @staticmethod
    def get_google_token(code, redirect_uri):
        data = {
            'grant_type': 'authorization_code',
            'client_id': '248773064708-bqnk5a6iq0lsa274bdcf5ije21lmqi5p.apps.googleusercontent.com',
            'client_secret': 'Mqqwr9bM6fGnrE_evdDhEUXQ',
            'redirect_uri': redirect_uri,
            'code': code,
        }
        encoded_data = parse.urlencode(data).encode()
        try:
            req = request.Request('https://www.googleapis.com/oauth2/v4/token', data=encoded_data)
            resp = request.urlopen(req)
            response_dict = loads(resp.read().decode('utf-8'))
        except Exception as e:
            abort(401)
        return response_dict['access_token']
    
    @staticmethod
    def get_google_user(token):
        try:
            req = request.Request('https://www.googleapis.com/oauth2/v1/userinfo?alt=json')
            req.add_header('Authorization', 'Bearer ' + token)
            resp = request.urlopen(req)
            response_dict = loads(resp.read().decode('utf-8'))
        except Exception as e:
            abort(401)
        return response_dict
    
    @staticmethod
    def get_user_by_google_id_or_none(google_user_id):
        return User.query.filter_by(google_user_id=google_user_id).first()
    
    @staticmethod
    def get_user_by_email_or_none(email):
        return User.query.filter_by(email=email).first()
