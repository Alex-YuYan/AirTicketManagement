from flask import Flask, jsonify
from db import Database
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config.from_mapping(
    DB_NAME="flightmgr",
    DB_USER="root",
    DB_PASSWORD="root",
    DB_HOST="127.0.0.1",
    DB_PORT="8889",
)

db = Database()
db.init_app(app)

cors = cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/example")
def example():
    query = "SELECT * FROM Flight WHERE flight_number = :flight_number"
    result = db.execute(query, {"flight_number": 211}, fetch=True)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)