from settings import app
from data import db_session
from sqlalchemy import and_
from data.users.users import User
from flask_login import current_user, login_required
from flask import jsonify, request
from settings import POST_IMAGES_DIR, POST_COMMENT_IMAGES_DIR
from data.posts.posts import Post, PostImage, UserPostLike, PostComment, PostCommentImage
import os


@app.route('/switch_post_like', methods=['POST'])
@login_required
def switch_post_like():
    try:
        post_id = request.form.get('postId')
        action = request.form.get('action')
        db_sess = db_session.create_session()
        user = db_sess.query(User).get(current_user.id)
        post = db_sess.query(Post).get(post_id)
        if action == 'add':
            new_relationship = UserPostLike(user_id=user.id, post_id=post.id)
            db_sess.add(new_relationship)
            post.like_count += 1
        else:
            existing_relationship = db_sess.query(UserPostLike).filter(and_(UserPostLike.user_id == user.id, UserPostLike.post_id == post.id)).first()
            db_sess.delete(existing_relationship)
            post.like_count -= 1
        db_sess.commit()
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Something went wrong'}), 500


@app.route('/upload_post', methods=['POST'])
@login_required
def upload_post():
    try:
        text = request.form.get('text')
        img_count = request.form.get('img_count')
        db_sess = db_session.create_session()
        user = db_sess.query(User).get(current_user.id)
        new_post = Post(
            content=text,
            user_id=current_user.id,
            user=user
        )
        db_sess.add(new_post)
        db_sess.commit()
        for i in range(1, int(img_count) + 1):
            cur_img = request.files[f'photo_{i}']
            url = f"post_{str(new_post.id)}_image_{i}.jpg"
            file_path = os.path.join(POST_IMAGES_DIR, url)
            new_post_image = PostImage(
                url=url,
                post_id=new_post.id
            )
            new_post.images.append(new_post_image)
            cur_img.save(file_path)
            db_sess.add(new_post_image)
        db_sess.commit()
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Something went wrong'}), 500


@app.route('/upload_post_comment', methods=['POST'])
@login_required
def upload_post_comment():
    try:
        post_id = int(request.form.get('post_id'))
        text = request.form.get('text')
        img_count = request.form.get('img_count')
        db_sess = db_session.create_session()
        new_post_comment  = PostComment(
            content=text,
            user_id=current_user.id,
            post_id=post_id,
        )
        db_sess.add(new_post_comment)
        db_sess.commit()
        for i in range(1, int(img_count) + 1):
            cur_img = request.files[f'photo_{i}']
            url = f"post_comment_{str(new_post_comment.id)}_image_{i}.jpg"
            file_path = os.path.join(POST_COMMENT_IMAGES_DIR, url)
            new_post_image = PostCommentImage(
                url=url,
                post_comment_id=new_post_comment.id
            )
            new_post_comment.images.append(new_post_image)
            cur_img.save(file_path)
            db_sess.add(new_post_image)
        new_post_comment.handling_images = False
        db_sess.commit()
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Something went wrong'}), 500


@app.route('/get_post_comments', methods=['POST'])
@login_required
def get_post_comments():
    try:
        form = request.form
        db_sess = db_session.create_session()
        fetch_post_comments = []
        if form:
            for key in form:
                comment_list = form.get(key).split()
                post_id = int(comment_list[0])
                latest_comment_id = int(comment_list[1])
                post = db_sess.query(Post).get(post_id)
                latest_comments = filter(lambda comment: comment.id > latest_comment_id and not comment.handling_images, post.comments)
                new_post_comments = [{
                    'id' : comment.id,
                    'content': comment.content,
                    'createdDate': comment.created_date.strftime('%Y-%m-%d %H:%M:%S.%f'),
                    'userId': comment.user.id,
                    'userImg': comment.user.img,
                    'userFullname': comment.user.fullname,
                    'postId': post_id,  
                    'images': [image.url for image in comment.images]
                } for comment in latest_comments]
                fetch_post_comments.append(new_post_comments)
        return jsonify({'commentLists': fetch_post_comments, 
                        'message': 'Success'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Something went wrong'}), 500