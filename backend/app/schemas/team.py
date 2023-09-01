"""File for Team schemas."""


from typing import TYPE_CHECKING

from pydantic import BaseModel, ConfigDict, Field

if TYPE_CHECKING:
    from app.schemas.coach import Coach


class TeamBase(BaseModel):
    """Base Team schema."""

    name: str | None = None


class TeamCreate(TeamBase):
    """Team schema for creation."""

    coach_id: int = Field(..., ge=1)
    name: str


class Team(TeamBase):
    """Team schema for returning data from DB."""

    name: str
    coach: "Coach"


class TeamUpdate(TeamBase):
    """Team schema for updating."""


class TeamInDBBase(TeamBase):
    """Base Team schema for storing in DB."""

    model_config = ConfigDict(from_attributes=True)

    user_id: int | None = None
    coach: "Coach"