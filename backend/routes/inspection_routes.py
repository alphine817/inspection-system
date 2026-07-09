from flask import Blueprint, jsonify, request

from models import InspectionStatus
from services.inspection_service import InspectionService
from utils.http import error_response, require_json_fields
from utils.serializers import serialize_inspection

inspections_bp = Blueprint("inspections", __name__, url_prefix="/api/inspections")


@inspections_bp.route("", methods=["GET"])
def list_inspections():
    unit_id = request.args.get("unit_id", type=int)
    inspector_id = request.args.get("inspector_id", type=int)
    status_value = request.args.get("status")

    if unit_id:
        inspections = InspectionService.list_by_unit(unit_id)
    elif inspector_id:
        inspections = InspectionService.list_by_inspector(inspector_id)
    elif status_value:
        inspections = InspectionService.list_by_status(InspectionStatus(status_value))
    else:
        inspections = InspectionService.list_by_status(InspectionStatus.SCHEDULED)

    return jsonify([serialize_inspection(inspection) for inspection in inspections])


@inspections_bp.route("", methods=["POST"])
def create_inspection():
    payload = request.get_json(silent=True)
    validation_error = require_json_fields(
        payload,
        "unit_id",
        "inspector_id",
        "scheduled_date",
    )
    if validation_error:
        return error_response(validation_error)

    try:
        inspection = InspectionService.create_from_payload(payload)
    except ValueError as exc:
        return error_response(str(exc))

    return jsonify(serialize_inspection(inspection)), 201


@inspections_bp.route("/<int:inspection_id>", methods=["PATCH"])
def update_inspection(inspection_id: int):
    from datetime import datetime, timezone

    payload = request.get_json(silent=True)
    if not payload:
        return error_response("Request body must be JSON.")

    inspection = InspectionService.get_by_id(inspection_id)
    if not inspection:
        return error_response("Inspection not found.", 404)

    if "status" in payload:
        try:
            status = InspectionStatus(payload["status"])
        except ValueError:
            return error_response("Invalid status.")

        completed_at = None
        if status == InspectionStatus.COMPLETED:
            completed_at = datetime.now(timezone.utc)

        InspectionService.update_status(inspection, status, completed_at)

    if "notes" in payload:
        inspection.notes = str(payload["notes"]).strip() or None
        from models import db

        db.session.commit()

    return jsonify(serialize_inspection(inspection))
