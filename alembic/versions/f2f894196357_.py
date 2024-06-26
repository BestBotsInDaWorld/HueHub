"""empty message

Revision ID: f2f894196357
Revises: aac6e0080336
Create Date: 2024-04-04 20:08:13.351520

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f2f894196357'
down_revision: Union[str, None] = 'aac6e0080336'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'dialog_images', type_='foreignkey')
    op.create_foreign_key(None, 'dialog_images', 'dialog_messages', ['dialog_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'dialog_images', type_='foreignkey')
    op.create_foreign_key(None, 'dialog_images', 'dialogs', ['dialog_id'], ['id'])
    # ### end Alembic commands ###
