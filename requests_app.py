from settings import login_manager, app
from data import db_session
from data.users.users import User
from flask_login import current_user
from flask import jsonify
from sqlalchemy import or_, and_
from data import db_session


def check_relationship(user_1, user_2):
    if user_1 == user_2: return "Same"
    elif user_2 in user_1.friends: return "Friends"
    elif user_2 in user_1.received_requests: return "Received"
    elif user_2 in user_1.sent_requests: return "Sent"
    return "None"



@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    user = db_sess.query(User).get(user_id)
    return user


@app.route('/get_users_by_fullname/<text>', methods=['GET'])
def get_users_by_fullname(text):
    text = text.split()
    first = text[0]
    second = text[1] if len(text) > 1 else ""
    db_sess = db_session.create_session()
    cur_user = db_sess.query(User).get(current_user.id)
    users = db_sess.query(User).filter(or_(and_(User.name.ilike(f'%{first}%'), User.surname.ilike(f'%{second}%')),
                                           and_(User.name.ilike(f'%{second}%'), User.surname.ilike(f'%{first}%')))).all()
    return jsonify([{'name': user.name, 'surname': user.surname, 'img': user.img, 'status': check_relationship(user, cur_user), 'id': user.id} for user in users])
