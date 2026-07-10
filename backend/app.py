import os

from flask import Flask, jsonify
from flask_cors import CORS

from config.settings import get_database_uri, load_config
from models import db
from routes import register_routes

load_config()

app = Flask(__name__)
CORS(app)

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-change-in-production")
app.config["SQLALCHEMY_DATABASE_URI"] = get_database_uri()
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
register_routes(app)

def _ensure_unit_columns() -> None:
    """Add columns to existing SQLite databases created before they existed."""
    from sqlalchemy import inspect, text

    inspector = inspect(db.engine)
    if "units" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("units")}
    migrations = {
        "monthly_rent": "ALTER TABLE units ADD COLUMN monthly_rent FLOAT",
        "image_url": "ALTER TABLE units ADD COLUMN image_url VARCHAR(500)",
    }

    with db.engine.begin() as connection:
        for column_name, statement in migrations.items():
            if column_name not in columns:
                connection.execute(text(statement))


with app.app_context():
    db.create_all()
    _ensure_unit_columns()


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
