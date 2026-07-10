from flask import Blueprint, jsonify, request

from services.unit_service import UnitService
from utils.http import error_response, require_json_fields
from utils.serializers import serialize_unit

units_bp = Blueprint("units", __name__, url_prefix="/api/units")


@units_bp.route("", methods=["GET"])
def list_units():
    property_id = request.args.get("property_id", type=int)

    if property_id:
        units = UnitService.list_by_property(property_id)
    else:
        units = UnitService.list_all()

    return jsonify([serialize_unit(unit) for unit in units])


@units_bp.route("", methods=["POST"])
def create_unit():
    payload = request.get_json(silent=True)
    validation_error = require_json_fields(payload, "property_id", "unit_number")
    if validation_error:
        return error_response(validation_error)

    try:
        property_id = int(payload["property_id"])
    except (TypeError, ValueError):
        return error_response("property_id must be a valid integer.")

    try:
        unit = UnitService.create_from_payload(
            {
                "property_id": property_id,
                "unit_number": payload["unit_number"],
                "bedrooms": _optional_int(payload.get("bedrooms")),
                "bathrooms": _optional_float(payload.get("bathrooms")),
                "square_feet": _optional_int(payload.get("square_feet")),
                "monthly_rent": _optional_float(payload.get("monthly_rent")),
            }
        )
    except ValueError as exc:
        return error_response(str(exc))

    return jsonify(serialize_unit(unit)), 201


def _optional_int(value):
    if value is None or value == "":
        return None
    return int(value)


def _optional_float(value):
    if value is None or value == "":
        return None
    return float(value)
