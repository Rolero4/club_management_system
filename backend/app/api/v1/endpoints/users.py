"""Users related endpoints."""


from typing import Annotated

from app.crud.crud_user import create_new_user, get_user_by_email
from app.db.session import get_db
from app.schemas.user import User, UserCreate
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.post(
    "/register",
    response_model=User,
    responses={
        status.HTTP_400_BAD_REQUEST: {"detail": "User already exists."},
    },
)
def register(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    """Creates a new user based on data from a POST request.

    Args:
        user (UserCreate): User data from POST request.
        db (Session, optional): Database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: HTTPException if there was an error while creating new user.

    Returns:
        new_user (UserBase): A newly created user.
    """
    if get_user_by_email(email=user.email, db=db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists.",
        )
    return create_new_user(user=user, db=db)
