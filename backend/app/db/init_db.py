"""File for initializing database with data."""


from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.exceptions import MissingException
from app.crud.crud_user import create_new_user, get_user_by_email
from app.db import base  # pylint: disable=unused-import
from app.schemas.enums import Roles
from app.schemas.user import UserCreateWithRole


def init_db(db: Session) -> None:
    """Function to initialize the database with data.

    Args:
        db (Session): Database session.
    """
    try:
        user = get_user_by_email(get_settings().SUPER_USER_EMAIL, db)
    except (MissingException, SQLAlchemyError):
        user = None
    if not user:
        new_user = UserCreateWithRole(
            full_name=get_settings().SUPER_USER_FULL_NAME,
            email=get_settings().SUPER_USER_EMAIL,
            password=get_settings().SUPER_USER_PASSWORD,
            role=Roles.ADMIN,
        )
        user = create_new_user(new_user, db)
