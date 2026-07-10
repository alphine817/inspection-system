import secrets
from datetime import date, datetime, timezone

from werkzeug.security import generate_password_hash

from models import Booking, BookingStatus, Unit, User, UserRole, db
from services.unit_service import UnitService
from services.user_service import UserService


def _split_full_name(full_name: str) -> tuple[str, str]:
    parts = full_name.strip().split(None, 1)
    first_name = parts[0] if parts else "Tenant"
    last_name = parts[1] if len(parts) > 1 else "Applicant"
    return first_name, last_name


def _parse_move_in_date(value: str) -> date:
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise ValueError("Preferred move-in date must be a valid ISO date (YYYY-MM-DD).") from exc


class BookingService:
    """Business logic for public rental bookings and tenant auto-registration."""

    @staticmethod
    def create_from_payload(data: dict) -> tuple[Booking, bool]:
        """
        Create a booking request and ensure the applicant has a tenant account.

        Returns the booking and whether a new user account was created.
        """
        unit_id = int(data["unit_id"])
        email = data["email"].strip().lower()
        full_name = data["full_name"].strip()
        phone = data.get("phone", "").strip() or None
        move_in_date = _parse_move_in_date(data["preferred_move_in_date"])

        unit = UnitService.get_by_id(unit_id)
        if not unit or not unit.is_active:
            raise ValueError("Unit not found.")

        if unit.tenant_id is not None:
            raise ValueError("This unit is no longer available.")

        user = UserService.get_by_email(email)
        account_created = False

        if not user:
            temp_password = secrets.token_urlsafe(16)
            first_name, last_name = _split_full_name(full_name)
            user = User(
                email=email,
                password_hash=generate_password_hash(temp_password),
                first_name=first_name,
                last_name=last_name,
                phone=phone,
                role=UserRole.TENANT,
            )
            user = UserService.create(user)
            account_created = True
        elif phone and not user.phone:
            user.phone = phone
            db.session.commit()

        move_in_datetime = datetime.combine(
            move_in_date,
            datetime.min.time(),
            tzinfo=timezone.utc,
        )

        booking = Booking(
            unit_id=unit.id,
            user_id=user.id,
            preferred_move_in_date=move_in_datetime,
            status=BookingStatus.PENDING,
        )
        db.session.add(booking)
        db.session.commit()

        return booking, account_created
