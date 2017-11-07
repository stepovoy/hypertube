#!/usr/bin/env python

from app import create_app
from app import db
import os
import sys
from app.users.user_model import User
from app.movies.movie_model import Movie


cfg = 'development'
app = create_app(cfg)


if __name__ == '__main__':

    if not os.path.exists('./app/static/users'):
        os.mkdir('./app/static/users')
    with app.app_context():
        db.create_all()
        if User.query.get(1) is None:
            user = User()
            data = {
              'login': 'kotlin',
               'email': 'ladonya.s@gmail.com',
              'first_name': 'Kotlin',
              'last_name': 'Jackson',
              'passwd': '1234567q',
              'avatar64': None
            }
            user.import_data(data)
            user.activated = 1
            db.session.add(user)
            db.session.commit()
            user.create_userfolder()
    app.run(threaded=True)
