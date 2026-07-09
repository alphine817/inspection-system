"""
Seed mock data into the Rental Property Inspection System database.

Usage:
    python seed.py

Safe to run multiple times — existing records are detected and skipped.
"""

from werkzeug.security import generate_password_hash

from app import app
from models import Property, Unit, User, UserRole, db

# Stable identifiers used for duplicate detection
ADMIN_EMAIL = "admin@rentalinspection.local"
DEFAULT_ADMIN_PASSWORD = "Admin123!"
TENANT_EMAIL = "tenant@rentalinspection.local"
DEFAULT_TENANT_PASSWORD = "Tenant123!"

PROPERTIES = [
    {
        "name": "Sunset Apartments",
        "address_line1": "123 Ngong Road",
        "address_line2": "Kilimani",
        "city": "Nairobi",
        "state": "Nairobi County",
        "postal_code": "00100",
        "country": "Kenya",
        "notes": "Mid-rise residential block with 24-hour security.",
        "units": [
            {"unit_number": "101", "bedrooms": 1, "bathrooms": 1.0, "square_feet": 650},
            {"unit_number": "102", "bedrooms": 2, "bathrooms": 1.0, "square_feet": 850},
            {"unit_number": "201", "bedrooms": 2, "bathrooms": 2.0, "square_feet": 920},
        ],
    },
    {
        "name": "Greenview Estates",
        "address_line1": "45 Mombasa Road",
        "address_line2": "Syokimau",
        "city": "Machakos",
        "state": "Machakos County",
        "postal_code": "00501",
        "country": "Kenya",
        "notes": "Gated community with shared amenities and parking.",
        "units": [
            {"unit_number": "A1", "bedrooms": 3, "bathrooms": 2.0, "square_feet": 1100},
            {"unit_number": "A2", "bedrooms": 3, "bathrooms": 2.5, "square_feet": 1250},
        ],
    },
]


def get_or_create_tenant() -> tuple[User, bool]:
    """Return the demo tenant user and whether it was newly created."""
    tenant = User.query.filter_by(email=TENANT_EMAIL).first()
    if tenant:
        return tenant, False

    tenant = User(
        email=TENANT_EMAIL,
        password_hash=generate_password_hash(DEFAULT_TENANT_PASSWORD),
        first_name="Demo",
        last_name="Tenant",
        phone="+254700000010",
        role=UserRole.TENANT,
    )
    db.session.add(tenant)
    db.session.flush()
    return tenant, True


def get_or_create_admin() -> tuple[User, bool]:
    """Return the admin user and whether it was newly created."""
    admin = User.query.filter_by(email=ADMIN_EMAIL).first()
    if admin:
        return admin, False

    admin = User(
        email=ADMIN_EMAIL,
        password_hash=generate_password_hash(DEFAULT_ADMIN_PASSWORD),
        first_name="System",
        last_name="Admin",
        phone="+254700000001",
        role=UserRole.ADMIN,
    )
    db.session.add(admin)
    db.session.flush()
    return admin, True


def get_or_create_property(admin: User, data: dict) -> tuple[Property, bool]:
    """Return a property and whether it was newly created."""
    property_ = Property.query.filter_by(name=data["name"]).first()
    if property_:
        return property_, False

    property_ = Property(
        name=data["name"],
        address_line1=data["address_line1"],
        address_line2=data.get("address_line2"),
        city=data["city"],
        state=data["state"],
        postal_code=data["postal_code"],
        country=data["country"],
        notes=data.get("notes"),
        property_manager_id=admin.id,
    )
    db.session.add(property_)
    db.session.flush()
    return property_, True


def get_or_create_unit(property_: Property, unit_data: dict) -> tuple[Unit, bool]:
    """Return a unit and whether it was newly created."""
    unit = Unit.query.filter_by(
        property_id=property_.id,
        unit_number=unit_data["unit_number"],
    ).first()
    if unit:
        return unit, False

    unit = Unit(
        property_id=property_.id,
        unit_number=unit_data["unit_number"],
        bedrooms=unit_data.get("bedrooms"),
        bathrooms=unit_data.get("bathrooms"),
        square_feet=unit_data.get("square_feet"),
    )
    db.session.add(unit)
    db.session.flush()
    return unit, True


def seed() -> None:
    """Insert mock data when it is not already present."""
    with app.app_context():
        db.create_all()

        created_users = 0
        created_properties = 0
        created_units = 0

        admin, admin_created = get_or_create_admin()
        if admin_created:
            created_users += 1

        tenant, tenant_created = get_or_create_tenant()
        if tenant_created:
            created_users += 1

        first_unit = None
        for property_data in PROPERTIES:
            property_, property_created = get_or_create_property(admin, property_data)
            if property_created:
                created_properties += 1

            for unit_data in property_data["units"]:
                unit, unit_created = get_or_create_unit(property_, unit_data)
                if unit_created:
                    created_units += 1
                if first_unit is None:
                    first_unit = unit

        if first_unit and first_unit.tenant_id is None:
            first_unit.tenant_id = tenant.id

        db.session.commit()

        print("Seed complete.")
        print(f"  Users created:      {created_users}")
        print(f"  Properties created: {created_properties}")
        print(f"  Units created:      {created_units}")
        print(f"  Totals in database: {User.query.count()} users, "
              f"{Property.query.count()} properties, {Unit.query.count()} units")

        if admin_created:
            print(f"\nAdmin login: {ADMIN_EMAIL} / {DEFAULT_ADMIN_PASSWORD}")
        if tenant_created:
            print(f"Tenant login: {TENANT_EMAIL} / {DEFAULT_TENANT_PASSWORD}")
        if first_unit and first_unit.tenant_id == tenant.id:
            print(f"Demo tenant linked to unit {first_unit.unit_number}")


if __name__ == "__main__":
    seed()
