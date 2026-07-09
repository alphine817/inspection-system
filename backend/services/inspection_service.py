from datetime import datetime, timezone
from typing import Optional

from models import Inspection, InspectionItem, InspectionStatus, Unit, User, UserRole, db


class InspectionService:
    """Business logic for inspections and checklist items."""

    @staticmethod
    def get_by_id(inspection_id: int) -> Optional[Inspection]:
        return Inspection.query.get(inspection_id)

    @staticmethod
    def list_by_unit(unit_id: int) -> list[Inspection]:
        return (
            Inspection.query.filter_by(unit_id=unit_id)
            .order_by(Inspection.scheduled_date.desc())
            .all()
        )

    @staticmethod
    def list_by_inspector(inspector_id: int) -> list[Inspection]:
        return (
            Inspection.query.filter_by(inspector_id=inspector_id)
            .order_by(Inspection.scheduled_date.desc())
            .all()
        )

    @staticmethod
    def list_by_status(status: InspectionStatus) -> list[Inspection]:
        return (
            Inspection.query.filter_by(status=status)
            .order_by(Inspection.scheduled_date)
            .all()
        )

    @staticmethod
    def create(inspection: Inspection) -> Inspection:
        db.session.add(inspection)
        db.session.commit()
        return inspection

    @staticmethod
    def create_from_payload(data: dict) -> Inspection:
        unit = Unit.query.get(data["unit_id"])
        if not unit:
            raise ValueError("Unit not found.")

        inspector = User.query.get(data["inspector_id"])
        if not inspector:
            raise ValueError("Inspector not found.")
        if inspector.role != UserRole.INSPECTOR:
            raise ValueError("Selected user is not an inspector.")

        scheduled_raw = data["scheduled_date"]
        try:
            scheduled_date = datetime.fromisoformat(scheduled_raw.replace("Z", "+00:00"))
        except ValueError as exc:
            raise ValueError("Invalid scheduled_date format.") from exc

        if scheduled_date.tzinfo is None:
            scheduled_date = scheduled_date.replace(tzinfo=timezone.utc)

        inspection = Inspection(
            unit_id=unit.id,
            inspector_id=inspector.id,
            scheduled_date=scheduled_date,
            notes=data.get("notes", "").strip() or None,
            status=InspectionStatus.SCHEDULED,
        )
        return InspectionService.create(inspection)

    @staticmethod
    def add_item(item: InspectionItem) -> InspectionItem:
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def update_status(
        inspection: Inspection,
        status: InspectionStatus,
        completed_at: datetime | None = None,
    ) -> Inspection:
        inspection.status = status
        if completed_at is not None:
            inspection.completed_at = completed_at
        db.session.commit()
        return inspection
