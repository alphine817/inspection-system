from flask import jsonify


def error_response(message: str, status: int = 400):
    return jsonify({"error": message}), status


def require_json_fields(payload: dict | None, *fields: str) -> str | None:
    if not payload:
        return "Request body must be JSON."

    missing = [field for field in fields if not str(payload.get(field, "")).strip()]
    if missing:
        return f"Missing required fields: {', '.join(missing)}."

    return None
