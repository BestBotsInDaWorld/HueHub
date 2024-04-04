from settings import login_manager, app
from data import db_session
from data.users.users import User
from flask_login import current_user
from flask import jsonify
from sqlalchemy import or_, and_
from data import db_session
from data.chats import Chat


db_session.global_init("db/zero_one.db")
db_sess = db_session.create_session()
chat = db_sess.query(Chat).get(1)
print(chat.users)