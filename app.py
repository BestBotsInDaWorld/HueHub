from flask import render_template, make_response, jsonify
from flask_login import login_required, current_user
from settings import *
from flask import render_template
from sqlalchemy.orm import joinedload
from data import db_session


from authorization_app import *
from chats_app import *
from dialogs_app import *
from friends_app import *
from posts_app import *
from profile_app import *
from requests_app import *
from scheduler_jobs import *
from settings import *


def main():
    db_session.global_init("db/zero_one.db")
    app.run()


@app.route("/")
@login_required
def index():
    db_sess = db_session.create_session()
    user = db_sess.query(User).get(current_user.id)
    posts = []
    for friend in user.friends:
        posts += friend.posts
    posts = list(sorted(posts, key=lambda post: post.created_date, reverse=True))
    return render_template("index.html", user=user, posts=posts)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@app.errorhandler(400)
def bad_request(_):
    return make_response(jsonify({'error': 'Bad Request'}), 400)


@app.errorhandler(401)
def not_authorized(_):
    return redirect('/login')


if __name__ == '__main__':
    main()
