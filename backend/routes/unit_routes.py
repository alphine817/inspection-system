from flask import Blueprint, jsonify, request

from services.unit_service import UnitService

units_bp = Blueprint("units", __name__, url_prefix="/api/units")


@units_bp.route("", methods=["GET"])
def list_units():
    property_id = request.args.get("property_id", type=int)

    if property_id:
        units = UnitService.list_by_property(property_id)
    else:
        units = UnitService.list_all()

    return jsonify([
        {
            "id": unit.id,
            "property_id": unit.property_id,
            "unit_number": unit.unit_number,
            "bedrooms": unit.bedrooms,
            "bathrooms": unit.bathrooms,
            "square_feet": unit.square_feet,
            "tenant_id": unit.tenant_id,
            "is_active": unit.is_active,
        }
        for unit in units
    ])
