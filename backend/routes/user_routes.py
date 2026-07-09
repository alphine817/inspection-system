from flask import Blueprint, jsonify, request

from services.user_service import UserService
from utils.http import error_response, require_json_fields
from utils.serializers import serialize_user

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.route("", methods=["GET"])
def list_users():
    users = UserService.list_all()
    return jsonify([serialize_user(user) for user in users])


@users_bp.route("", methods=["POST"])
def create_user():
    payload = request.get_json(silent=True)
    validation_error = require_json_fields(
        payload,
        "email",
        "password",
        "first_name",
        "last_name",
        "role",
    )
    if validation_error:
        return error_response(validation_error)

    if len(payload["password"]) < 8:
        return error_response("Password must be at least 8 characters.")

    try:
        user = UserService.create_from_payload(payload)
    except ValueError as exc:
        return error_response(str(exc))

    return jsonify(serialize_user(user)), 201
