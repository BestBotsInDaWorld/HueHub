import sqlalchemy
from .db_session import SqlAlchemyBase


post_to_category = sqlalchemy.Table(
    'post_to_category',
    SqlAlchemyBase.metadata,
    sqlalchemy.Column('post_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('posts.id'), primary_key=True),
    sqlalchemy.Column('category_id', sqlalchemy.Integer,
                      sqlalchemy.ForeignKey('categories.id'), primary_key=True)
)


class Category(SqlAlchemyBase):
    __tablename__ = 'categories'
    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True,
                           autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=True)