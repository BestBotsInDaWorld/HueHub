import datetime
import sqlalchemy
from flask_login import UserMixin
from ..db_session import SqlAlchemyBase
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin


class TemporaryUser(SqlAlchemyBase, UserMixin, SerializerMixin):
    __tablename__ = 'temporary_users'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    surname = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    email = sqlalchemy.Column(sqlalchemy.String, index=True, unique=True, nullable=True)  # индекс для ускорения поиска
    hashed_password = sqlalchemy.Column(sqlalchemy.String, nullable=True)
    created_date = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.now)  # datetime.datetime.now функция

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)