import datetime
import sqlalchemy
from flask_login import UserMixin
from sqlalchemy import orm
from ..db_session import SqlAlchemyBase
from .friendships import Friendship, PendingFriendship
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin


class User(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'users'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    surname = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    fullname = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    email = sqlalchemy.Column(sqlalchemy.String, index=True, unique=True, nullable=True)  # индекс для ускорения поиска
    hashed_password = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.now)  # datetime.datetime.now функция
    img = sqlalchemy.Column(sqlalchemy.String, nullable=True, default="noavatar.jpg")
    posts = orm.relationship("Post", backref='user')
    friends = orm.relationship('User', secondary='friendships', 
                               primaryjoin=(id == Friendship.user_id), 
                               secondaryjoin=(id == Friendship.friend_id))   # дружба двухсторонняя, создаются две сразу при принятии запроса
    sent_requests = orm.relationship('User', secondary='pending_friendships', 
                               primaryjoin=(id == PendingFriendship.user_id), 
                               secondaryjoin=(id == PendingFriendship.friend_id))  # отправленные запросы в др
    received_requests = orm.relationship('User', secondary='pending_friendships', 
                            primaryjoin=(id == PendingFriendship.friend_id), 
                            secondaryjoin=(id == PendingFriendship.user_id))  # полученные запросы в др
    chats = orm.relationship("Chat", secondary="user_to_chat", backref="user")
    dialogs = orm.relationship("Dialog", secondary="user_to_dialog", backref="user")
    liked_posts = orm.relationship('Post',secondary="user_post_likes", backref="post_liking_user")
    liked_posts_comments = orm.relationship('PostComment', backref='comment_liking_user')

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)
    
    def sorted_friends(self):
        return sorted(self.friends, key=lambda friend: friend.surname)
    
    def sorted_received_requests(self):
        return sorted(self.received_requests, key=lambda friend: friend.surname)
    
    def sorted_sent_requests(self):
        return sorted(self.sent_requests, key=lambda friend: friend.surname)