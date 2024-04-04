"""empty message

Revision ID: 7b13cfc084d2
Revises: ba33639fca76
Create Date: 2024-04-01 17:24:27.740441

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7b13cfc084d2'
down_revision: Union[str, None] = 'ba33639fca76'
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
