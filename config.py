import os

SECRET_KEY = 'super-secret-key'
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///forum.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False