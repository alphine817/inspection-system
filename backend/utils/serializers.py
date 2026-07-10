def serialize_user(user) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone": user.phone,
        "role": user.role.value,
        "is_active": user.is_active,
    }


def serialize_property(property_) -> dict:
    return {
        "id": property_.id,
        "name": property_.name,
        "address_line1": property_.address_line1,
        "address_line2": property_.address_line2,
        "city": property_.city,
        "state": property_.state,
        "postal_code": property_.postal_code,
        "country": property_.country,
        "notes": property_.notes,
        "is_active": property_.is_active,
        "property_manager_id": property_.property_manager_id,
    }


def serialize_unit(unit) -> dict:
    return {
        "id": unit.id,
        "property_id": unit.property_id,
        "unit_number": unit.unit_number,
        "bedrooms": unit.bedrooms,
        "bathrooms": unit.bathrooms,
        "square_feet": unit.square_feet,
        "monthly_rent": unit.monthly_rent,
        "tenant_id": unit.tenant_id,
        "is_active": unit.is_active,
    }


def serialize_tenant_lease(unit) -> dict:
    property_ = unit.property
    return {
        "unit_id": unit.id,
        "unit_number": unit.unit_number,
        "property_name": property_.name,
        "street_address": property_.address_line1,
        "address_line2": property_.address_line2,
        "city": property_.city,
        "state": property_.state,
        "postal_code": property_.postal_code,
        "country": property_.country,
        "lease_terms": {
            "bedrooms": unit.bedrooms,
            "bathrooms": unit.bathrooms,
            "square_feet": unit.square_feet,
        },
    }


def serialize_inspection(inspection) -> dict:
    return {
        "id": inspection.id,
        "unit_id": inspection.unit_id,
        "inspector_id": inspection.inspector_id,
        "status": inspection.status.value,
        "scheduled_date": inspection.scheduled_date.isoformat(),
        "completed_at": inspection.completed_at.isoformat() if inspection.completed_at else None,
        "notes": inspection.notes,
    }
