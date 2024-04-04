from flask import Flask
from flask_mail import Mail
from apscheduler.schedulers.background import BackgroundScheduler
from itsdangerous import URLSafeTimedSerializer
from flask_login import LoginManager
import os

template_dir = os.path.abspath('../HueHub/static')
app = Flask(__name__, template_folder=template_dir)
SECRET_KEY = 'sorryhunter'
app.config['SECRET_KEY'] = SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/zero_one.db?check_same_thread=False'
app.config['TEMPLATES_AUTO_RELOAD'] = True

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'huehubmessenger@gmail.com'
app.config['MAIL_PASSWORD'] = 'vzlz toqm bzoo uuji'

mail_app = Mail(app)
scheduler = BackgroundScheduler()
scheduler.start()

serializer = URLSafeTimedSerializer(SECRET_KEY)

login_manager = LoginManager()
login_manager.init_app(app)


SRC_DIR = 'src'
PROFILE_AVATARS_DIR = f"{SRC_DIR}/img/profile_avatars/"
GROUP_AVATARS_DIR = f"{SRC_DIR}/img/group_avatars/"
POST_IMAGES_DIR = f"{SRC_DIR}/img/post_images/"
POST_COMMENT_IMAGES_DIR = f"{SRC_DIR}/img/post_comment_images/"
DIALOG_IMAGES_DIR = f"{SRC_DIR}/img/dialog_images/"
CHAT_IMAGES_DIR = f"{SRC_DIR}/img/chat_images/"