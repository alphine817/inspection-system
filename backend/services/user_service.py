from typing import Optional

from werkzeug.security import generate_password_hash

from models import User, UserRole, db


class UserService:
    """Business logic for user accounts and roles."""

    @staticmethod
    def get_by_id(user_id: int) -> Optional[User]:
        return User.query.get(user_id)

    @staticmethod
    def get_by_email(email: str) -> Optional[User]:
        return User.query.filter_by(email=email).first()

    @staticmethod
    def list_by_role(role: UserRole) -> list[User]:
        return User.query.filter_by(role=role, is_active=True).order_by(User.last_name).all()

    @staticmethod
    def list_all() -> list[User]:
        return User.query.order_by(User.last_name, User.first_name).all()

    @staticmethod
    def create(user: User) -> User:
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def create_from_payload(data: dict) -> User:
        email = data["email"].strip().lower()

        if UserService.get_by_email(email):
            raise ValueError("A user with this email already exists.")

        role_value = data["role"]
        try:
            role = UserRole(role_value)
        except ValueError as exc:
            raise ValueError(f"Invalid role: {role_value}.") from exc

        user = User(
            email=email,
            password_hash=generate_password_hash(data["password"]),
            first_name=data["first_name"].strip(),
            last_name=data["last_name"].strip(),
            phone=data.get("phone", "").strip() or None,
            role=role,
        )
        return UserService.create(user)
