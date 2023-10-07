"""File responsible for implementing meetinges related CRUD operations."""


from typing import Callable, Sequence

from app.core.exceptions import DuplicateException, GenericException, MissingException
from app.crud.crud_user import get_user_by_id
from app.models.meeting import Meeting
from app.models.meeting_user import MeetingUser
from app.models.user import User
from app.schemas.meeting import MeetingCreate, MeetingUpdate
from sqlalchemy import func, or_, select, update
from sqlalchemy.exc import IntegrityError, NoResultFound, SQLAlchemyError
from sqlalchemy.orm import Session

func: Callable


def create_new_meeting(meeting: MeetingCreate, db: Session) -> Meeting:
    """Creates a new meeting based on meeting data.

    Args:
        meeting (MeetingCreate): Meeting based on Meeting schema.
        db (Session): Database session.

    Raises:
        DuplicateException: If there is already a meeting with the given id.
        SQLAlchemyError: If there is a database error.

    Returns:
        new_meeting (Meeting): Meeting object.
    """
    try:
        get_user_by_id(meeting.user_id, db)
        new_meeting = Meeting(
            user_id=meeting.user_id,
            name=meeting.name,
            notes=meeting.notes,
            date=meeting.date,
        )
        db.add(new_meeting)
        db.commit()
        db.refresh(new_meeting)
        return new_meeting
    except IntegrityError as exc:
        raise DuplicateException(Meeting.__name__) from exc
    except SQLAlchemyError as exc:
        raise exc


def get_meeting_by_id(meeting_id: int, db: Session) -> Meeting:
    """Gets the meeting based on the given meeting id.

    Args:
        meeting_id (int): Meeting id.
        db (Session): Database session.

    Raises:
        MissingException: If no meeting matches the given meeting id.
        SQLAlchemyError: If there is a database error.

    Returns:
        Meeting: Meeting object.
    """
    try:
        return db.execute(select(Meeting).where(Meeting.id == meeting_id)).scalar_one()
    except NoResultFound as exc:
        raise MissingException(Meeting.__name__) from exc
    except SQLAlchemyError as exc:
        raise exc


def get_all_meetings(
    page: int,
    per_page: int,
    db: Session,
) -> tuple[Sequence[Meeting], int]:
    """Gets all meetings with pagination.

    Args:
        page (int): The current page number.
        per_page (int): The number of items per page.
        db (Session): Database session.

    Raises:
        SQLAlchemyError: If there is a database error.

    Returns:
        tuple[Sequence[Meeting], int]: The list of all meetings alongside the total number of them.
    """
    try:
        query = select(Meeting)
        total = db.scalar(select(func.count()).select_from(query))
        return (
            db.scalars(
                query.order_by(Meeting.date.desc(), Meeting.id.desc())
                .offset(page * per_page)
                .limit(per_page)
            ).all(),
            total,
        )
    except SQLAlchemyError as exc:
        raise exc


def get_meetings_by_user_id(
    page: int, per_page: int, user_id: int, db: Session
) -> tuple[Sequence[Meeting], int]:
    """Gets all meetings that were either created by the current user or the current user
        is part of their attendance.

    Args:
        page (int): The current page number.
        per_page (int): The number of items per page.
        user_id (int): The current user's id.
        db (Session): Database session.

    Raises:
        SQLAlchemyError: If there is a database error.

    Returns:
        tuple[Sequence[Meeting], int]: The filtered list of meetings alongside the total number of
            meetings that meet the criteria.
    """
    try:
        query = (
            select(Meeting)
            .outerjoin(MeetingUser)
            .group_by(Meeting.id)
            .where(or_(MeetingUser.user_id == user_id, Meeting.user_id == user_id))
        )
        total = db.scalar(select(func.count()).select_from(query))
        return (
            db.scalars(
                query.order_by(Meeting.date.desc(), Meeting.id.desc())
                .offset(page * per_page)
                .limit(per_page)
            ).all(),
            total,
        )
    except SQLAlchemyError as exc:
        raise exc


def update_meeting_with_user_ids(
    meeting_update: MeetingUpdate,
    user_ids: set[int],
    db: Session,
) -> Meeting:
    """Updates meeting data with the given data.

    Args:
        meeting_update (MeetingUpdate): Meeting data to update.
        user_ids (set[int]): User ids to be added.
        db (Session): Database session.

    Raises:
        GenericException: If any of the provided user ids matches the current user id.
        MissingException: If any of the provided user ids does not match an existing user.
        MissingException: If no meeting matches the given meeting id.
        SQLAlchemyError: If there is a database error.

    Returns:
        Meeting: The updated Meeting object.
    """
    try:
        query = select(Meeting).where(Meeting.id == meeting_update.id)
        meeting = db.execute(query).scalar_one()

        if meeting_update.user_id in user_ids:
            raise GenericException(
                "The list of user ids cannot contain the creator's id."
            )
        users = list(db.scalars(select(User).where(User.id.in_(user_ids))).all())
        if not users or len(users) != len(user_ids):
            raise MissingException(User.__name__)
        users_to_add = [user for user in users if user not in meeting.users]
        users_to_update = [
            user for user in meeting.users if user in users
        ] + users_to_add
        meeting.users = users_to_update
        db.execute(
            update(Meeting)
            .where(Meeting.id == meeting_update.id)
            .values(**meeting_update.__dict__)
        )
        db.commit()
        return meeting
    except NoResultFound as exc:
        raise MissingException(Meeting.__name__) from exc
    except SQLAlchemyError as exc:
        raise exc
