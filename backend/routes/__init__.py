from routes.auth_routes import auth_bp
from routes.dashboard_routes import dashboard_bp
from routes.inspection_routes import inspections_bp
from routes.property_routes import properties_bp
from routes.tenant_routes import tenant_bp
from routes.unit_routes import units_bp
from routes.user_routes import users_bp


def register_routes(app) -> None:
    """Register all API blueprints on the Flask app."""
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(properties_bp)
    app.register_blueprint(units_bp)
    app.register_blueprint(inspections_bp)
    app.register_blueprint(tenant_bp)


__all__ = ["register_routes"]
