"""empty message

Revision ID: ba33639fca76
Revises: a45f2615748b
Create Date: 2024-04-01 17:11:42.689599

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ba33639fca76'
down_revision: Union[str, None] = 'a45f2615748b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chat_messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('chat_id', sa.Integer(), nullable=False),
    sa.Column('created_date', sa.DateTime(), nullable=True),
    sa.Column('content', sa.String(), nullable=True),
    sa.Column('handling_images', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['chat_id'], ['chats.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('chat_images',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('url', sa.String(), nullable=True),
    sa.Column('chat_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['chat_id'], ['chat_messages.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_constraint(None, 'dialog_images', type_='foreignkey')
    op.create_foreign_key(None, 'dialog_images', 'dialog_messages', ['dialog_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'dialog_images', type_='foreignkey')
    op.create_foreign_key(None, 'dialog_images', 'dialogs', ['dialog_id'], ['id'])
    op.drop_table('chat_images')
    op.drop_table('chat_messages')
    # ### end Alembic commands ###
