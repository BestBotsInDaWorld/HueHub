from requests_app import load_user
from flask_login import current_user, login_required
from flask import render_template, request, jsonify
from settings import app
from sqlalchemy import and_
from data.users.users import User
from data.users.friendships import PendingFriendship
from data import db_session
import json


@app.route('/friends')
@login_required
def friends():
    user = load_user(current_user.id)
    return render_template('friends.html', 
                           user=user, 
                           friends=user.sorted_friends(), 
                           sent_requests=user.sorted_sent_requests(), 
                           received_requests=user.sorted_received_requests())


@app.route('/send_friend_request', methods=['POST'])
@login_required
def send_friend_request():
    data = json.loads(request.data)
    db_sess = db_session.create_session()
    friend_id = data.get('friendId', 0)
    try:
        new_friendship = PendingFriendship(user_id=current_user.id,
                                        friend_id=friend_id)
        db_sess.add(new_friendship)
        db_sess.commit()
        return jsonify({'message': "Success"}), 200
    except Exception as e:
        return jsonify({'message': "Failed to send friend invite"}), 500


@app.route('/accept_friend_request', methods=['POST'])
@login_required
def accept_friend_request():
    data = json.loads(request.data)
    db_sess = db_session.create_session()
    friend_id = data.get('friendId', 0)
    try:
        #  отправитель - другой юзер, получатель этот
        pending_friendship = db_sess.query(PendingFriendship).filter(and_(PendingFriendship.user_id == friend_id,
                                                                        PendingFriendship.friend_id == current_user.id)).first()
        db_sess.delete(pending_friendship)
        user = db_sess.query(User).get(current_user.id)
        friend = db_sess.query(User).get(friend_id)
        user.friends.append(friend)
        friend.friends.append(user)
        db_sess.commit()
        return jsonify({'message': "Success"}), 200
    except Exception as e:
        return jsonify({'message': "Failed to accept friend invite"}), 500


@app.route('/deny_friend_request', methods=['POST'])
@login_required
def deny_friend_request():
    data = json.loads(request.data)
    db_sess = db_session.create_session()
    user_id = data.get('userId', 0)
    friend_id = data.get('friendId', 0)
    try:
        pending_friendship = db_sess.query(PendingFriendship).filter(and_(PendingFriendship.user_id == user_id,
                                                                        PendingFriendship.friend_id == friend_id)).first()
        db_sess.delete(pending_friendship)
        db_sess.commit()
        return jsonify({'message': "Success"}), 200
    except Exception as e:
        return jsonify({'message': "Failed to deny friend invite"}), 500


@app.route('/delete_friend', methods=['POST'])
@login_required
def delete_friend():
    data = json.loads(request.data)
    db_sess = db_session.create_session()
    user_id = data.get('userId', 0)
    friend_id = data.get('friendId', 0)
    try:
        user = db_sess.query(User).get(user_id)
        friend = db_sess.query(User).get(friend_id)
        user.friends.remove(friend)
        friend.friends.remove(user)
        db_sess.commit()
        return jsonify({'message': "Success"}), 200
    except Exception as e:
        return jsonify({'message': "Failed to delete friend"}), 500
    

@app.route('/get_user_friends/<action>', methods=['GET'])
def get_friends(action):
    try:
        user = load_user(current_user.id)
        if action == 'received': user_list = user.sorted_received_requests()
        elif action == 'sent': user_list = user.sorted_sent_requests()
        else: user_list = user.sorted_friends()
        return jsonify({'message': 'Success', 
                        'results': [{ 'id': friend.id, 'fullname': friend.fullname, 'img': friend.img} for friend in user_list] }), 200
    except Exception as e:
        return jsonify({'message': 'Something went wrong'}), 500