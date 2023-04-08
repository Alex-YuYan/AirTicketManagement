from functools import wraps
import hashlib
from flask import Flask, jsonify, request, session
import sqlalchemy
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
app.secret_key = "flightmgr"

db = Database()
db.init_app(app)

cors = cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

'''
    User Authentication Related
'''
def customer_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'customer_email' not in session:
            # Return an empty JSON object and a 401 Unauthorized status code
            return jsonify({}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route("/customer/login", methods=["POST"])
@cross_origin()
def login():
    query = "SELECT * FROM Customer WHERE email = :email AND password = :password"

    email = request.form.get("email")
    password = request.form.get("password")

    result = db.execute(query, {"email": email, "password": password}, fetch=True)
    if len(result) == 1:
        session['customer_email'] = result[0]['email']
        return jsonify({"success": True})
    return jsonify({"success": False})

@app.route("/customer/register", methods=["POST"])
@cross_origin()
def register():
    query = "INSERT INTO Customer (email, password, first_name, last_name) VALUES (:email, :password, :first_name, :last_name)"
    # query = "INSERT INTO Customer (email) VALUES ('test@email.com')"

    email = request.form.get("email")
    password = request.form.get("password")
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")

    try:
        result = db.execute(query, {"email": email, "password": password, "first_name": first_name, "last_name": last_name})
    except sqlalchemy.exc.IntegrityError as e:
        return jsonify({"success": False, "error": "Email already exists, please just login"})
    return jsonify({"success": True})

@app.route("/customer/logout", methods=["POST"])
@cross_origin()
@customer_login_required
def logout():
    session.pop('customer_email', None)
    return jsonify({"success": True})

'''
    Customer Related
'''
@app.route("/search/one-way/<dept_airport>/<arrival_airport>/<dept_date>", methods=["GET"])
@cross_origin()
@customer_login_required
def search_oneway(dept_airport, arrival_airport, dept_date):
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