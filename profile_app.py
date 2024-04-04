from flask import render_template, make_response, request, jsonify
from flask_login import login_required, current_user
from sqlalchemy.orm import joinedload
from data import db_session
from data.users.users import User
from data.posts.posts import Post
from settings import *
from flask import render_template
from data import db_session
from requests_app import check_relationship
import os


@app.route('/profile/<user_id>')
@login_required
def profile(user_id):
    db_sess = db_session.create_session()
    user = db_sess.query(User).get(current_user.id)
    profile_user = db_sess.query(User).get(user_id)
    # joinedload пригружает имэджи сразу в сессии, а не после как "lazy load", что предотвращает ошибки с загрузкой объектов вне зоны дб сессии
    posts =  sorted(db_sess.query(Post).options(joinedload(Post.images)).filter_by(user_id=user_id).all(), key=lambda post: post.created_date, reverse=True) 
    if profile_user is None:
        return make_response(jsonify({'error': 'User not found!'}), 404)
    return render_template('profile.html', user=user, posts=posts, profile_user=profile_user, relationship=check_relationship(user, profile_user))


@app.route('/export_profile_photo', methods=['POST'])
def export_photo():
    try:
        blob_photo = request.files['photo']
        db_sess = db_session.create_session()
        user = db_sess.query(User).get(current_user.id)
        user.img = f"user_img_{str(current_user.id)}.jpg"
        file_path = os.path.join(PROFILE_AVATARS_DIR, user.img)
        blob_photo.save(file_path)
        db_sess.commit()
        return jsonify({'success': True}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    
