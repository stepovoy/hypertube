from datetime import datetime
from flask import url_for
from ..exceptions import ValidationError
from app import db


class Comment(db.Model):
    __tablename__ = 'comments'
    comment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    movie_id = db.Column(db.Integer, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), index=True)
    msg = db.Column(db.Text, nullable=False)
    # date_time = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    date_time = db.Column(db.Integer, default=int(datetime.now().timestamp()))
    
    def get_url(self):
        return url_for('user_controllers.get_all_comments', movie_id=self.movie_id)
    
    @staticmethod
    def export_data(comments):
        result = list()
        for user, comment in comments:
            result.append({
                'user_id': comment.user_id,
                'movie_id': comment.movie_id,
                'msg': comment.msg,
                'date_time': comment.date_time,
                'login': user.login,
                'avatar_url': user.avatar_url
            })
        return result
    
    def import_data(self, data):
        try:
            self.movie_id = data['movie_id']
            self.user_id = data['user_id']
            self.msg = data['msg']
        except KeyError as e:
            raise ValidationError('Invalid msg: missing ' + e.args[0])
