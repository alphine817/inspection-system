from flask import Blueprint, jsonify, request

from services.auth_service import AuthService
from services.user_service import UserService
from utils.http import error_response, require_json_fields

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
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

    return jsonify(AuthService.build_auth_response(user)), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    payload = request.get_json(silent=True)
    validation_error = require_json_fields(payload, "email", "password")
    if validation_error:
        return error_response(validation_error)

    user = AuthService.authenticate(payload["email"], payload["password"])
    if not user:
        return error_response("Invalid email or password.", 401)

    return jsonify(AuthService.build_auth_response(user))
