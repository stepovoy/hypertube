from flask import Blueprint

movies_blueprint = Blueprint('movie_controllers', __name__)

from . import movie_controllers
