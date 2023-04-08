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

@app.route("/search/one-way/<dept_airport>/<arrival_airport>/<dept_date>", methods=["GET"])
@cross_origin()
def example(dept_airport, arrival_airport, dept_date):
    query = "SELECT * FROM Flight WHERE dept_airport = :dept_airport AND arrival_airport = :arrival_airport AND (dept_date_time BETWEEN :dept_date AND :dept_date_next_day)"

    # Convert date in the format of YYYY-MM-DD to mysql datetime format
    dept_date_next_day = dept_date + " 23:59:59"
    dept_date = dept_date + " 00:00:00"
    
    result = db.execute(query, {"dept_airport": dept_airport, 
                                "arrival_airport": arrival_airport, 
                                "dept_date": dept_date, 
                                "dept_date_next_day": dept_date_next_day},
                        fetch=True)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)