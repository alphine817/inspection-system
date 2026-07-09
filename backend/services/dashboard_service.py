from datetime import datetime, timedelta, timezone

from models import Inspection, InspectionStatus, Property, Unit


class DashboardService:
    """Aggregated metrics for the admin dashboard."""

    @staticmethod
    def get_stats() -> dict:
        now = datetime.now(timezone.utc)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow_start = today_start + timedelta(days=1)

        inspections_today = Inspection.query.filter(
            Inspection.scheduled_date >= today_start,
            Inspection.scheduled_date < tomorrow_start,
        ).count()

        overdue_inspections = Inspection.query.filter(
            Inspection.scheduled_date < today_start,
            Inspection.status.in_([InspectionStatus.SCHEDULED, InspectionStatus.IN_PROGRESS]),
        ).count()

        return {
            "inspections_today": inspections_today,
            "overdue_inspections": overdue_inspections,
            "open_maintenance_tickets": 0,
            "total_properties": Property.query.count(),
            "total_units": Unit.query.count(),
        }
