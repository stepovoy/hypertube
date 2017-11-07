import os

basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
app_dir = os.path.join(basedir, 'app')
db_path = os.path.join(basedir, 'data.sqlite')
upload_folder = os.path.join(basedir, 'app', 'static', 'users')


NG_ADDRESS = 'http://10.111.7.4:4300'
NG_ADDRESS_RU = 'http://10.111.7.4:4200'
ROOT_DIRECTORY = os.getcwd()
APP_DIRECTORY = app_dir
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + db_path
SQLALCHEMY_TRACK_MODIFICATIONS = False
UPLOAD_FOLDER = upload_folder
SECRET_KEY = 'wilhelm-marduk'
JWT_ALGORITHM = 'HS256'
DEBUG = False
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_TLS = True
MAIL_USE_SSL = False
MAIL_USERNAME = 'hyper42tube@gmail.com'
MAIL_PASSWORD = '3121712Sl'
