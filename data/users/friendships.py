from ..db_session import SqlAlchemyBase
import sqlalchemy


class Friendship(SqlAlchemyBase):
    __tablename__ = 'friendships'
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), primary_key=True)
    friend_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), primary_key=True)


class PendingFriendship(SqlAlchemyBase):
    __tablename__ = 'pending_friendships'
    user_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), primary_key=True)
    friend_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('users.id'), primary_key=True)