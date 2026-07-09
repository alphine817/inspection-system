from flask import Blueprint, g, jsonify

from services.tenant_service import TenantService
from utils.auth import require_auth
from utils.serializers import serialize_tenant_lease

tenant_bp = Blueprint("tenant", __name__, url_prefix="/api/tenant")


@tenant_bp.route("/lease", methods=["GET"])
@require_auth
def get_tenant_lease():
    """Return active lease details for the authenticated tenant user."""
    units = TenantService.list_active_leases_for_tenant(g.current_user.id)
    leases = [serialize_tenant_lease(unit) for unit in units]
    return jsonify({"leases": leases})
