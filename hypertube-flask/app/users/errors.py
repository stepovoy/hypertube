from flask import jsonify
from . import users_blueprint
from ..exceptions import ValidationError


@users_blueprint.app_errorhandler(ValidationError)
def bad_request(e):
    response = jsonify({
        'status': 400,
        'error': 'bad request',
        'message': e.args[0]
    })
    response.status_code = 400
    return response


@users_blueprint.app_errorhandler(401)
def unauthorised(e):
    response = jsonify({
        'status': 401,
        'error': 'Unauthorised',
    })
    response.status_code = 401
    return response


@users_blueprint.app_errorhandler(403)
def not_found(e):
    response = jsonify({
        'status': 403,
        'error': 'forbidden',
        'message': 'access denied'
    })
    response.status_code = 400
    return response


@users_blueprint.app_errorhandler(400)
def not_found(e):
    response = jsonify({
        'status': 400,
        'error': 'bad request',
        'message': 'invalid data provided'
    })
    response.status_code = 400
    return response


@users_blueprint.app_errorhandler(404)
def not_found(e):
    response = jsonify({
        'status': 404,
        'error': 'not found',
        'message': 'invalid URI'
    })
    response.status_code = 404
    return response


@users_blueprint.app_errorhandler(409)
def conflict(e):
    response = jsonify({
        'status': 409,
        'error': 'conflict',
        'message': 'resource exists'
    })
    response.status_code = 409
    return response


@users_blueprint.app_errorhandler(405)
def method_not_supported(e):
    response = jsonify({
        'status': 405,
        'error': 'method not supported',
        'message': e.args[0]
    })
    response.status_code = 405
    return response


@users_blueprint.app_errorhandler(500)
def internal_server_error(e):
    response = jsonify({
        'status': 500,
        'error': 'internal servererror',
        'message': e.args
    })
    response.status_code = 500
    return response