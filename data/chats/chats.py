import datetime
import sqlalchemy
from sqlalchemy import orm
from sqlalchemy_serializer import SerializerMixin
from ..db_session import SqlAlchemyBase


user_to_chat = sqlalchemy.Table(
    'user_to_chat',
    SqlAlchemyBase.metadata,
    sqlalchemy.Column('user_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('users.id'), primary_key=True),
    sqlalchemy.Column('chat_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('chats.id'), primary_key=True)
)


chat_to_last_message = sqlalchemy.Table(
    'chat_to_last_message',
    SqlAlchemyBase.metadata,
    sqlalchemy.Column('chat_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('chats.id'), primary_key=True),
    sqlalchemy.Column('chat_message_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('chat_messages.id'), primary_key=True)
)


class Chat(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'chats'

    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    title = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    description = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    img = sqlalchemy.Column(sqlalchemy.String, nullable=True, default='default_chat_photo.jpg')
    owner = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'))
    created_date = sqlalchemy.Column(sqlalchemy.DateTime,
                                     default=datetime.datetime.now)
    last_update = sqlalchemy.Column(sqlalchemy.DateTime,
                                     default=datetime.datetime.now)
    users = orm.relationship('User', secondary='user_to_chat', backref='chat')
    messages = orm.relationship('ChatMessage', backref='chat')
    last_message = orm.relationship("ChatMessage", uselist=False, secondary='chat_to_last_message', backref='related_chat')
    chat_url = '/chat'
    avatar_dir = '/static/img/group_avatars'


class ChatMessage(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'chat_messages'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    user_id =  sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    chat_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('chats.id'), nullable=False)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime,
                                    default=datetime.datetime.now)
    content = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    handling_images = sqlalchemy.Column(sqlalchemy.Boolean, default=False)
    images = orm.relationship('ChatImage', backref='chat')
    user = orm.relationship('User')


class ChatImage(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'chat_images'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    url = sqlalchemy.Column(sqlalchemy.String)
    chat_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('chat_messages.id'), nullable=False)
