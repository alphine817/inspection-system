from typing import Optional

from models import Property, db


class PropertyService:
    """Business logic for rental properties."""

    @staticmethod
    def get_by_id(property_id: int) -> Optional[Property]:
        return Property.query.get(property_id)

    @staticmethod
    def get_by_name(name: str) -> Optional[Property]:
        return Property.query.filter_by(name=name).first()

    @staticmethod
    def list_active() -> list[Property]:
        return Property.query.filter_by(is_active=True).order_by(Property.name).all()

    @staticmethod
    def list_all() -> list[Property]:
        return Property.query.order_by(Property.name).all()

    @staticmethod
    def create(property_: Property) -> Property:
        db.session.add(property_)
        db.session.commit()
        return property_

    @staticmethod
    def create_from_payload(data: dict) -> Property:
        name = data["name"].strip()

        if PropertyService.get_by_name(name):
            raise ValueError("A property with this name already exists.")

        property_ = Property(
            name=name,
            address_line1=data["address_line1"].strip(),
            address_line2=data.get("address_line2", "").strip() or None,
            city=data["city"].strip(),
            state=data["state"].strip(),
            postal_code=data["postal_code"].strip(),
            country=data.get("country", "Kenya").strip() or "Kenya",
            notes=data.get("notes", "").strip() or None,
            property_manager_id=data.get("property_manager_id"),
        )
        return PropertyService.create(property_)
