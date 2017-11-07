from ..exceptions import ValidationError
from flask import url_for
from sqlalchemy import PrimaryKeyConstraint
from app import db


class WatchedMovie(db.Model):
    __tablename__ = 'watched_movies'
    movie_id = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), index=True)
    __table_args__ = (PrimaryKeyConstraint('movie_id', 'user_id', name='watched_movies_pk'),
                      {})
    
    def get_url(self):
        return url_for('user_controllers.get_watched_movies', user_id=self.user_id, _external=True)
    
    def export_data(self):
        return self.movie_id
    
    def import_data(self, data):
        try:
            self.movie_id = data['movie_id']
            self.user_id = data['user_id']
        except KeyError as e:
            raise ValidationError('Invalid WatchMovie: missing ' + e.args[0])
