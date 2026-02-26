"""Initial schema – robots, sensor_readings, predictions

Revision ID: 0001_initial
Revises:
Create Date: 2026-02-25
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "robots",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("robot_name", sa.String(120), nullable=False),
        sa.Column("model_number", sa.String(80), nullable=False),
        sa.Column("installation_date", sa.DateTime(timezone=True), nullable=False),
        sa.Column("status", sa.String(30), server_default="active"),
    )

    op.create_table(
        "sensor_readings",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("robot_id", sa.Integer(), sa.ForeignKey("robots.id", ondelete="CASCADE"), nullable=False),
        sa.Column("temperature", sa.Float(), nullable=False),
        sa.Column("vibration", sa.Float(), nullable=False),
        sa.Column("current", sa.Float(), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_sensor_readings_robot_id", "sensor_readings", ["robot_id"])

    op.create_table(
        "predictions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("robot_id", sa.Integer(), sa.ForeignKey("robots.id", ondelete="CASCADE"), nullable=False),
        sa.Column("failure_probability", sa.Float(), nullable=False),
        sa.Column("risk_level", sa.String(10), nullable=False),
        sa.Column("explanation", sa.JSON(), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_predictions_robot_id", "predictions", ["robot_id"])


def downgrade() -> None:
    op.drop_table("predictions")
    op.drop_table("sensor_readings")
    op.drop_table("robots")
