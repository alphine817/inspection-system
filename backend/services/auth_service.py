from typing import Optional

from flask import current_app
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.security import check_password_hash

from models import User
from services.user_service import UserService

TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7


class AuthService:
    """Authentication helpers for login tokens and credential checks."""

    @staticmethod
    def _serializer() -> URLSafeTimedSerializer:
        secret = current_app.config["SECRET_KEY"]
        return URLSafeTimedSerializer(secret, salt="propstat-auth-token")

    @staticmethod
    def create_token(user_id: int) -> str:
        return AuthService._serializer().dumps({"user_id": user_id})

    @staticmethod
    def verify_token(token: str) -> Optional[int]:
        try:
            payload = AuthService._serializer().loads(token, max_age=TOKEN_MAX_AGE_SECONDS)
        except (BadSignature, SignatureExpired):
            return None

        user_id = payload.get("user_id")
        return user_id if isinstance(user_id, int) else None

    @staticmethod
    def authenticate(email: str, password: str) -> Optional[User]:
        user = UserService.get_by_email(email.strip().lower())
        if not user or not user.is_active:
            return None
        if not check_password_hash(user.password_hash, password):
            return None
        return user

    @staticmethod
    def build_auth_response(user: User) -> dict:
        from utils.serializers import serialize_user

        return {
            "token": AuthService.create_token(user.id),
            "user": serialize_user(user),
        }
