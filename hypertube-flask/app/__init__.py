import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail


# to be deleted when switch to pg
from sqlalchemy.engine import Engine
from sqlalchemy import event


db = SQLAlchemy()
mail = Mail()


def create_app(config_name):
    app = Flask(__name__)
    CORS(app)
    
    cfg = os.path.join(os.getcwd(), 'config', config_name + '.py')
    app.config.from_pyfile(cfg)
    
    db.init_app(app)
    mail.init_app(app)
    
    from .users import users_blueprint
    from .movies import movies_blueprint
    
    app.register_blueprint(users_blueprint)
    # app.register_blueprint(movies_blueprint)
    
    return app


# to be deleted when switch to pg
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()
