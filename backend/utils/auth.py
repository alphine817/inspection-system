from functools import wraps

from flask import g, request

from services.auth_service import AuthService
from services.user_service import UserService
from utils.http import error_response


def get_bearer_token() -> str | None:
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:].strip()
    return None


def get_current_user_id() -> int | None:
    token = get_bearer_token()
    if not token:
        return None
    return AuthService.verify_token(token)


def require_auth(view):
    """Decorator that loads the authenticated user into ``g.current_user``."""

    @wraps(view)
    def wrapped(*args, **kwargs):
        user_id = get_current_user_id()
        if not user_id:
            return error_response("Authentication required.", 401)

        user = UserService.get_by_id(user_id)
        if not user or not user.is_active:
            return error_response("Authentication required.", 401)

        g.current_user = user
        return view(*args, **kwargs)

    return wrapped
