from flask import url_for
from app import db
from ..exceptions import ValidationError


class Movie(db.Model):
    __tablename__ = 'movies'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128))
    year = db.Column(db.String(16))
    rating = db.Column(db.Integer)
    photo_url = db.Column(db.String(256))
    genre = db.Column(db.String(256))
    director = db.Column(db.String(64))
    actors = db.Column(db.String(256))
    description = db.Column(db.Text)
    magnet_720 = db.Column(db.String(512))
    magnet_1080 = db.Column(db.String(512))
    
    def import_data(self, data):
        try:
            for key, value in data.items():
                setattr(self, key, value)
        except KeyError as e:
            raise ValidationError('Invalid movie: missing ' + e.args[0])
        return self
    
    def get_self_url(self):
        return url_for('movie_controllers.watch', id=self.id,
                       title=self.title, _external=True)
    
    def get_search_item(self):
        return {
            'id': self.id,
            'title': self.title,
            'year': self.year,
            'rating': self.rating,
            'photo_url': self.photo_url,
            'genre': self.genre,
            'director': self.director,
            'actors': self.actors,
            'description': self.description,
            'magnet_720': self.magnet_720,
            'magnet_1080': self.magnet_1080
        }
    
    def get_watch_item(self):
        return {
            'id': self.id,
            'title': self.title,
            'year': self.year,
            'rating': self.rating,
            'photo_url': self.photo_url,
            'genre': self.genre,
            'director': self.director,
            'actors': self.actors,
        }
