import datetime
import sqlalchemy
from sqlalchemy import orm
from sqlalchemy_serializer import SerializerMixin
from ..db_session import SqlAlchemyBase


class UserPostLike(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'user_post_likes'

    user_id = sqlalchemy.Column(sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('users.id'), primary_key=True)
    post_id = sqlalchemy.Column(sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('posts.id'), primary_key=True)


class Post(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'posts'

    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    content = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime,
                                     default=datetime.datetime.now)
    user_id = sqlalchemy.Column(sqlalchemy.Integer,
                                sqlalchemy.ForeignKey("users.id"))
    like_count = sqlalchemy.Column(sqlalchemy.Integer, default=0)
    owner = orm.relationship("User")
    categories = orm.relationship("Category", secondary="post_to_category", backref="post")
    images = orm.relationship("PostImage", backref="post")
    comments = orm.relationship("PostComment", backref="post")


class PostImage(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'post_images'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    url = sqlalchemy.Column(sqlalchemy.String)
    post_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('posts.id'), nullable=False)


class PostComment(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'post_comments'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    user_id =  sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    post_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('posts.id'), nullable=False)
    like_count = sqlalchemy.Column(sqlalchemy.Integer, default=0)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime,
                                    default=datetime.datetime.now)
    content = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    handling_images = sqlalchemy.Column(sqlalchemy.Boolean, default=True)
    user = orm.relationship("User")
    images = orm.relationship("PostCommentImage", backref="post_comment")



class PostCommentImage(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'post_comment_images'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    url = sqlalchemy.Column(sqlalchemy.String)
    post_comment_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('post_comments.id'), nullable=False)