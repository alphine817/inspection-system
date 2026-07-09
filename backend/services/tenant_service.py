from models import Unit


class TenantService:
    """Lease and unit lookups for tenant users."""

    @staticmethod
    def list_active_leases_for_tenant(tenant_id: int) -> list[Unit]:
        return (
            Unit.query.filter_by(tenant_id=tenant_id, is_active=True)
            .order_by(Unit.property_id, Unit.unit_number)
            .all()
        )
