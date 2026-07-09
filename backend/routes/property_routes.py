from flask import Blueprint, jsonify, request

from services.property_service import PropertyService
from utils.http import error_response, require_json_fields
from utils.serializers import serialize_property

properties_bp = Blueprint("properties", __name__, url_prefix="/api/properties")


@properties_bp.route("", methods=["GET"])
def list_properties():
    properties = PropertyService.list_active()
    return jsonify([serialize_property(property_) for property_ in properties])


@properties_bp.route("", methods=["POST"])
def create_property():
    payload = request.get_json(silent=True)
    validation_error = require_json_fields(
        payload,
        "name",
        "address_line1",
        "city",
        "state",
        "postal_code",
    )
    if validation_error:
        return error_response(validation_error)

    try:
        property_ = PropertyService.create_from_payload(payload)
    except ValueError as exc:
        return error_response(str(exc))

    return jsonify(serialize_property(property_)), 201
