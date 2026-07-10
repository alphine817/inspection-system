from typing import Optional

from models import Unit, db
from services.property_service import PropertyService


class UnitService:
    """Business logic for property units."""

    @staticmethod
    def get_by_id(unit_id: int) -> Optional[Unit]:
        return Unit.query.get(unit_id)

    @staticmethod
    def get_by_property_and_number(property_id: int, unit_number: str) -> Optional[Unit]:
        return Unit.query.filter_by(property_id=property_id, unit_number=unit_number).first()

    @staticmethod
    def list_by_property(property_id: int) -> list[Unit]:
        return (
            Unit.query.filter_by(property_id=property_id, is_active=True)
            .order_by(Unit.unit_number)
            .all()
        )

    @staticmethod
    def list_all() -> list[Unit]:
        return Unit.query.order_by(Unit.property_id, Unit.unit_number).all()

    @staticmethod
    def create(unit: Unit) -> Unit:
        db.session.add(unit)
        db.session.commit()
        return unit

    @staticmethod
    def create_from_payload(data: dict) -> Unit:
        property_id = data["property_id"]
        unit_number = str(data["unit_number"]).strip()

        if not PropertyService.get_by_id(property_id):
            raise ValueError("Property not found.")

        if UnitService.get_by_property_and_number(property_id, unit_number):
            raise ValueError("A unit with this number already exists for this property.")

        unit = Unit(
            property_id=property_id,
            unit_number=unit_number,
            bedrooms=data.get("bedrooms"),
            bathrooms=data.get("bathrooms"),
            square_feet=data.get("square_feet"),
            monthly_rent=data.get("monthly_rent"),
        )
        return UnitService.create(unit)
