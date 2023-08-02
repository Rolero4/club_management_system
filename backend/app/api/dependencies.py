"""File for API dependencies."""


from typing import Annotated, Optional

from fastapi import Cookie, Depends
from jose import ExpiredSignatureError, JWTError
from sqlalchemy.orm import Session

from app.core.exceptions import JWTTokensException
from app.core.jwt_utils import create_access_token, decode_token
from app.crud.crud_user import get_user_by_email
from app.db.session import get_db
from app.schemas.user import UserInDB


def refresh_token_dependency(
    access_token: Annotated[str | None, Cookie()] = None,
    refresh_token: Annotated[str | None, Cookie()] = None,
) -> Optional[str]:
    """Dependency to refresh access_token if it has expired.

    Args:
        access_token (str, optional): JWT access token. Defaults to None.
        refresh_token (str, optional): JWT refresh token. Defaults to None.

    Raises:
        JWTTokensException: If both tokens are expired.
        JWTTokensException: If any of tokens is invalid in another way.

    Returns:
        Optional[str]: Refreshed access_token if it has expired, otherwise None.
    """
    try:
        if not access_token or not refresh_token:
            raise JWTTokensException("Invalid tokens")
        decode_token(access_token)
        return None
    except ExpiredSignatureError:
        try:
            refresh_payload = decode_token(str(refresh_token))
            new_access_token = create_access_token({"sub": refresh_payload["sub"]})
            return new_access_token
        except ExpiredSignatureError as exc:
            raise JWTTokensException("Expired tokens") from exc
        except JWTError as exc:
            raise JWTTokensException("Invalid tokens") from exc
    except JWTError as exc:
        raise JWTTokensException("Expired tokens") from exc


def get_user_from_token(
    db: Annotated[Session, Depends(get_db)],
    access_token: Annotated[str | None, Cookie()] = None,
) -> UserInDB:
    """Decodes the token and returns the user read by decoded email.

    Args:
        db (Annotated[Session, Depends]): Database session. Defaults to Depends(get_db).
        access_token (str, optional): JWT access token. Defaults to None.

    Returns:
        User: User read by decoded email.
    """
    payload = decode_token(access_token or "")
    email = payload.get("sub")
    return get_user_by_email(str(email), db)