from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
# import logging
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

class Database:
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        app.config["SQLALCHEMY_DATABASE_URI"] = self.create_db_uri(
            app.config["DB_USER"],
            app.config["DB_PASSWORD"],
            app.config["DB_HOST"],
            app.config["DB_PORT"],
            app.config["DB_NAME"],
        )
        app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
        self.db = SQLAlchemy(app)
        app.teardown_appcontext(self.teardown)

    @staticmethod
    def create_db_uri(user, password, host, port, name):
        return f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}"

    def execute(self, query, params=None, fetch=False):
        with self.db.engine.connect() as connection:
            result_proxy = connection.execute(text(query), params)
            if fetch:
                rows = result_proxy.fetchall()
                column_names = result_proxy.keys()
                return [dict(zip(column_names, row)) for row in rows]
        return []

    def teardown(self, exception):
        self.db.session.remove()