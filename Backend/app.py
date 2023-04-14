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

CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'


'''
    Helper Functions
'''
def get_ticket_price(flight_number, dept_date_time, airline_name):
    # if flight is 80% full, price is 1.25x base price
    query = "SELECT COUNT(*) FROM Ticket WHERE flight_number = :flight_number AND dept_date_time = :dept_date_time AND airline_name = :airline_name"
    currentNum = db.execute(query, {"flight_number": flight_number, "dept_date_time": dept_date_time, "airline_name": airline_name}, fetch=True)
    query = "SELECT num_seat FROM Airplane WHERE airplane_id = (SELECT airplane_id FROM Flight WHERE flight_number = :flight_number AND dept_date_time = :dept_date_time AND airline_name = :airline_name)"
    totalNum = db.execute(query, {"flight_number": flight_number, "dept_date_time": dept_date_time, "airline_name": airline_name}, fetch=True)
    if len(currentNum) == 0 or len(totalNum) == 0:
        return 0
    if float(currentNum[0]['COUNT(*)']) >= float(totalNum[0]['num_seat']) * 0.8:
        query = "SELECT base_price * 1.25 AS price FROM Flight WHERE flight_number = :flight_number AND dept_date_time = :dept_date_time AND airline_name = :airline_name"
    else :
        query = "SELECT base_price AS price FROM Flight WHERE flight_number = :flight_number AND dept_date_time = :dept_date_time AND airline_name = :airline_name"
    price = db.execute(query, {"flight_number": flight_number, "dept_date_time": dept_date_time, "airline_name": airline_name}, fetch=True)
    return price[0]['price']

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

def staff_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'staff_username' not in session:
            # Return an empty JSON object and a 401 Unauthorized status code
            return jsonify({}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route("/verifyLogin", methods=["GET"])
def verify_login():
    if 'customer_email' in session:
        return jsonify({"success": True, "email": session['customer_email'], "role": "customer", "first_name": session['first_name'], "last_name": session['last_name']})
    elif 'staff_username' in session:
        return jsonify({"success": True, "username": session['staff_username'], "role": "staff"})
    return jsonify({"success": False})

@app.route("/customer/login", methods=["POST"])
def login():
    query = "SELECT * FROM Customer WHERE email = :email AND password = :password"

    email = request.json.get("email")
    password = request.json.get("password")

    try:
        result = db.execute(query, {"email": email, "password": password}, fetch=True)
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})
    if len(result) == 1:
        session['customer_email'] = result[0]['email']
        session['first_name'] = result[0]['first_name']
        session['last_name'] = result[0]['last_name']
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Invalid email or password"})

@app.route("/customer/register", methods=["POST"])
def customer_register():
    query = "INSERT INTO Customer (email, password, first_name, last_name) VALUES (:email, :password, :first_name, :last_name)"
    # query = "INSERT INTO Customer (email) VALUES ('test@email.com')"

    email = request.json.get("email")
    password = request.json.get("password")
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")

    try:
        result = db.execute(query, {"email": email, "password": password, "first_name": first_name, "last_name": last_name})
    except sqlalchemy.exc.IntegrityError as e:
        return jsonify({"success": False, "error": "Email already exists, please just login"})
    return jsonify({"success": True})

@app.route("/customer/logout", methods=["POST"])
@customer_login_required
def logout():
    try:
        session.clear()
    except Exception as e:
        return jsonify({"success": False})
    return jsonify({"success": True})

'''
    Customer Action Related
'''
@app.route("/search/one-way", methods=["GET"])
def search_oneway():
    query = "SELECT * FROM Flight WHERE dept_airport = :dept_airport AND arrival_airport = :arrival_airport AND (dept_date_time BETWEEN :dept_date AND :dept_date_next_day)"

    dept_date = request.args.get("dept_date")
    dept_airport = request.args.get("dept_airport")
    arrival_airport = request.args.get("arrival_airport")
    # Convert date in the format of YYYY-MM-DD to mysql datetime format
    dept_date_next_day = dept_date + " 23:59:59"
    dept_date = dept_date + " 00:00:00"
    
    try:
        result = db.execute(query, {"dept_airport": dept_airport, 
                                "arrival_airport": arrival_airport, 
                                "dept_date": dept_date, 
                                "dept_date_next_day": dept_date_next_day},
                        fetch=True)
        if len(result) == 0:
            return jsonify({"success": False, "error": "No flight found"})
        price = get_ticket_price(result[0]['flight_number'], result[0]['dept_date_time'], result[0]['airline_name'])
        result[0]['price'] = float(price)
        print(result)
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": "database error"})
    return jsonify({"success": True, "flights": result})

@app.route("/customer/flights", methods=["GET"])
@customer_login_required
def get_customer_flights():
    query = '''
        SELECT Flight.*, Ticket.id, Ticket.price
        FROM Flight
        INNER JOIN Ticket ON Ticket.flight_number = Flight.flight_number
            AND Ticket.dept_date_time = Flight.dept_date_time
            AND Ticket.airline_name = Flight.airline_name
        WHERE Ticket.email = :email
    '''
    email = session['customer_email']
    
    try:
        result = db.execute(query, {"email": email}, fetch=True)
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})
    return jsonify({"success": True, "flights": result})


if __name__ == "__main__":
    app.run(debug=True)