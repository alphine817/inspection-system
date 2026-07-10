from flask import Blueprint, jsonify, request

from services.booking_service import BookingService
from services.unit_service import UnitService
from utils.http import error_response, require_json_fields
from utils.serializers import serialize_booking, serialize_public_listing

bookings_bp = Blueprint("bookings", __name__, url_prefix="/api")


@bookings_bp.route("/listings", methods=["GET"])
def list_public_listings():
    """Return vacant units available for public booking."""
    units = UnitService.list_vacant()
    return jsonify([serialize_public_listing(unit) for unit in units])


@bookings_bp.route("/bookings", methods=["POST"])
def create_booking():
    payload = request.get_json(silent=True)
    validation_error = require_json_fields(
        payload,
        "unit_id",
        "full_name",
        "email",
        "preferred_move_in_date",
    )
    if validation_error:
        return error_response(validation_error)

    try:
        unit_id = int(payload["unit_id"])
    except (TypeError, ValueError):
        return error_response("unit_id must be a valid integer.")

    try:
        booking, account_created = BookingService.create_from_payload(
            {
                "unit_id": unit_id,
                "full_name": payload["full_name"],
                "email": payload["email"],
                "phone": payload.get("phone"),
                "preferred_move_in_date": payload["preferred_move_in_date"],
            }
        )
    except ValueError as exc:
        return error_response(str(exc))

    return jsonify(
        {
            "message": "Booking request received.",
            "booking": serialize_booking(booking, account_created=account_created),
        }
    ), 201
