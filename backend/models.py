"""
Database models for the Rental Property Inspection System.

Import `db` from this module in app.py and call db.init_app(app) after
configuring SQLALCHEMY_DATABASE_URI.
"""

from __future__ import annotations

import enum
from datetime import datetime, timezone
from typing import List, Optional

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Shared SQLAlchemy instance — initialize in app.py with db.init_app(app)
db = SQLAlchemy()


def _utcnow() -> datetime:
    """Return the current UTC timestamp (timezone-aware)."""
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------


class UserRole(str, enum.Enum):
    """Application roles used for authorization."""

    ADMIN = "admin"
    PROPERTY_MANAGER = "property_manager"
    INSPECTOR = "inspector"
    TENANT = "tenant"


class InspectionStatus(str, enum.Enum):
    """Lifecycle state of an inspection."""

    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ItemCondition(str, enum.Enum):
    """Condition recorded for a single inspection checklist item."""

    GOOD = "good"
    FAILED = "failed"


class BookingStatus(str, enum.Enum):
    """Lifecycle state of a rental booking request."""

    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------


class User(db.Model):
    """
    System user account.

    A user may act as a property manager, inspector, or tenant depending on role.
    Tenants are linked to units; inspectors are linked to inspections.
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(30))
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole, name="user_role", native_enum=False),
        nullable=False,
        index=True,
    )
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=_utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        default=_utcnow,
        onupdate=_utcnow,
        nullable=False,
    )

    # Units where this user is the assigned tenant (nullable on Unit side when vacant)
    leased_units: Mapped[List["Unit"]] = relationship(
        back_populates="tenant",
        foreign_keys="Unit.tenant_id",
    )

    # Inspections assigned to this user when role is INSPECTOR
    inspections: Mapped[List["Inspection"]] = relationship(
        back_populates="inspector",
        foreign_keys="Inspection.inspector_id",
    )

    # Properties managed by this user when role is ADMIN or PROPERTY_MANAGER
    managed_properties: Mapped[List["Property"]] = relationship(
        back_populates="property_manager",
        foreign_keys="Property.property_manager_id",
    )

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} role={self.role.value}>"


class Property(db.Model):
    """
    Rental property (building or portfolio entry).

    Contains one or more units and may be assigned to a property manager.
    """

    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    address_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    address_line2: Mapped[Optional[str]] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=False, default="Kenya")
    notes: Mapped[Optional[str]] = mapped_column(Text)
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    # Optional FK — property manager responsible for this property
    property_manager_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(default=_utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        default=_utcnow,
        onupdate=_utcnow,
        nullable=False,
    )

    property_manager: Mapped[Optional["User"]] = relationship(
        back_populates="managed_properties",
        foreign_keys=[property_manager_id],
    )
    units: Mapped[List["Unit"]] = relationship(
        back_populates="property",
        cascade="all, delete-orphan",
    )

    @property
    def full_address(self) -> str:
        parts = [self.address_line1]
        if self.address_line2:
            parts.append(self.address_line2)
        parts.append(f"{self.city}, {self.state} {self.postal_code}")
        parts.append(self.country)
        return ", ".join(parts)

    def __repr__(self) -> str:
        return f"<Property id={self.id} name={self.name!r}>"


class Unit(db.Model):
    """
    Individual rentable unit within a property.

    Each unit belongs to exactly one property and may be linked to one tenant user.
    """

    __tablename__ = "units"

    id: Mapped[int] = mapped_column(primary_key=True)
    property_id: Mapped[int] = mapped_column(
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    unit_number: Mapped[str] = mapped_column(String(50), nullable=False)
    bedrooms: Mapped[Optional[int]]
    bathrooms: Mapped[Optional[float]]
    square_feet: Mapped[Optional[int]]
    monthly_rent: Mapped[Optional[float]]
    image_url: Mapped[Optional[str]] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(default=True, nullable=False)

    # Nullable when the unit is vacant
    tenant_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(default=_utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        default=_utcnow,
        onupdate=_utcnow,
        nullable=False,
    )

    property: Mapped["Property"] = relationship(back_populates="units")
    tenant: Mapped[Optional["User"]] = relationship(
        back_populates="leased_units",
        foreign_keys=[tenant_id],
    )
    inspections: Mapped[List["Inspection"]] = relationship(
        back_populates="unit",
        cascade="all, delete-orphan",
    )
    bookings: Mapped[List["Booking"]] = relationship(
        back_populates="unit",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        db.UniqueConstraint("property_id", "unit_number", name="uq_property_unit_number"),
    )

    def __repr__(self) -> str:
        return f"<Unit id={self.id} property_id={self.property_id} unit_number={self.unit_number!r}>"


class Inspection(db.Model):
    """
    Scheduled or completed inspection for a unit.

    Links a unit to the inspector user performing the work.
    """

    __tablename__ = "inspections"

    id: Mapped[int] = mapped_column(primary_key=True)
    unit_id: Mapped[int] = mapped_column(
        ForeignKey("units.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    inspector_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    status: Mapped[InspectionStatus] = mapped_column(
        SQLEnum(InspectionStatus, name="inspection_status", native_enum=False),
        nullable=False,
        default=InspectionStatus.SCHEDULED,
        index=True,
    )
    scheduled_date: Mapped[datetime] = mapped_column(nullable=False, index=True)
    completed_at: Mapped[Optional[datetime]]
    notes: Mapped[Optional[str]] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(default=_utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        default=_utcnow,
        onupdate=_utcnow,
        nullable=False,
    )

    unit: Mapped["Unit"] = relationship(back_populates="inspections")
    inspector: Mapped["User"] = relationship(
        back_populates="inspections",
        foreign_keys=[inspector_id],
    )
    items: Mapped[List["InspectionItem"]] = relationship(
        back_populates="inspection",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return (
            f"<Inspection id={self.id} unit_id={self.unit_id} "
            f"status={self.status.value} scheduled_date={self.scheduled_date}>"
        )


class InspectionItem(db.Model):
    """
    Single checklist line item captured during an inspection.

    Stores room/item details, condition, optional notes, and an optional photo URL.
    """

    __tablename__ = "inspection_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    inspection_id: Mapped[int] = mapped_column(
        ForeignKey("inspections.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    room_name: Mapped[str] = mapped_column(String(100), nullable=False)
    item_name: Mapped[str] = mapped_column(String(150), nullable=False)
    condition: Mapped[ItemCondition] = mapped_column(
        SQLEnum(ItemCondition, name="item_condition", native_enum=False),
        nullable=False,
    )
    notes: Mapped[Optional[str]] = mapped_column(Text)
    photo_url: Mapped[Optional[str]] = mapped_column(String(500))

    created_at: Mapped[datetime] = mapped_column(default=_utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        default=_utcnow,
        onupdate=_utcnow,
        nullable=False,
    )

    inspection: Mapped["Inspection"] = relationship(back_populates="items")

    def __repr__(self) -> str:
        return (
            f"<InspectionItem id={self.id} inspection_id={self.inspection_id} "
            f"room={self.room_name!r} item={self.item_name!r} condition={self.condition.value}>"
        )


class Booking(db.Model):
    """
    Rental booking request submitted by a prospective or existing tenant.

    Links an applicant user account to a vacant unit with a preferred move-in date.
    """

    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)
    unit_id: Mapped[int] = mapped_column(
        ForeignKey("units.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    preferred_move_in_date: Mapped[datetime] = mapped_column(nullable=False)
    status: Mapped[BookingStatus] = mapped_column(
        SQLEnum(BookingStatus, name="booking_status", native_enum=False),
        nullable=False,
        default=BookingStatus.PENDING,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(default=_utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        default=_utcnow,
        onupdate=_utcnow,
        nullable=False,
    )

    unit: Mapped["Unit"] = relationship(back_populates="bookings")
    user: Mapped["User"] = relationship(foreign_keys=[user_id])

    def __repr__(self) -> str:
        return (
            f"<Booking id={self.id} unit_id={self.unit_id} user_id={self.user_id} "
            f"status={self.status.value}>"
        )
