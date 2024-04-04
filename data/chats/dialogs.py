import datetime
import sqlalchemy
from sqlalchemy import orm
from sqlalchemy_serializer import SerializerMixin
from ..db_session import SqlAlchemyBase


user_to_dialog = sqlalchemy.Table(
    'user_to_dialog',
    SqlAlchemyBase.metadata,
    sqlalchemy.Column('user_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('users.id'), primary_key=True),
    sqlalchemy.Column('dialog_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('dialogs.id'), primary_key=True)
)


dialog_to_last_message = sqlalchemy.Table(
    'dialog_to_last_message',
    SqlAlchemyBase.metadata,
    sqlalchemy.Column('dialog_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('dialogs.id'), primary_key=True),
    sqlalchemy.Column('dialog_message_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('dialog_messages.id'), primary_key=True)
)


class Dialog(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'dialogs'

    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime,
                                     default=datetime.datetime.now)
    last_update = sqlalchemy.Column(sqlalchemy.DateTime,
                                    default=datetime.datetime.now)
    users = orm.relationship('User', secondary='user_to_dialog', backref='dialog')
    messages = orm.relationship('DialogMessage', backref='dialog')
    last_message = orm.relationship("DialogMessage", uselist=False, secondary='dialog_to_last_message', backref='related_dialog')
    chat_url = '/dialog'
    avatar_dir = '/static/img/profile_avatars'


class DialogMessage(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'dialog_messages'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    user_id =  sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), nullable=False)
    dialog_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('dialogs.id'), nullable=False)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime,
                                    default=datetime.datetime.now)
    content = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    handling_images = sqlalchemy.Column(sqlalchemy.Boolean, default=False)
    images = orm.relationship('DialogImage', backref='dialog')
    user = orm.relationship('User')


class DialogImage(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'dialog_images'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True)
    url = sqlalchemy.Column(sqlalchemy.String)
    dialog_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('dialog_messages.id'), nullable=False)
