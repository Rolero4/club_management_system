"""Add has_started and has_ended columns to the matches table

Revision ID: 6de56f4cdffc
Revises: 1c2a69e96fe1
Create Date: 2023-11-01 15:57:26.450751

"""

# pylint: skip-file
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "6de56f4cdffc"
down_revision = "1c2a69e96fe1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "matches",
        sa.Column("has_started", sa.Boolean(), nullable=False, default=sa.sql.true()),
    )
    op.add_column(
        "matches",
        sa.Column("has_ended", sa.Boolean(), nullable=False, default=sa.sql.true()),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("matches", "has_ended")
    op.drop_column("matches", "has_started")
    # ### end Alembic commands ###