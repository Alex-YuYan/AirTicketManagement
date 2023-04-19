from datetime import datetime, time
from calendar import monthrange
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
    totalNum, currentNum = 0, 0
    query = "SELECT COUNT(*) FROM Ticket WHERE flight_number = :flight_number AND dept_date_time = :dept_date_time AND airline_name = :airline_name"
    try:
        currentNum = db.execute(query, {"flight_number": flight_number, "dept_date_time": dept_date_time, "airline_name": airline_name}, fetch=True)
    except Exception as e:
        return -1
    
    query = "SELECT num_seat FROM Airplane WHERE airplane_id = (SELECT airplane_id FROM Flight WHERE flight_number = :flight_number AND dept_date_time = :dept_date_time AND airline_name = :airline_name)"
    try:
        totalNum = db.execute(query, {"flight_number": flight_number, "dept_date_time": dept_date_time, "airline_name": airline_name}, fetch=True)
    except Exception as e:
        return -1
    
    if len(currentNum) == 0 or len(totalNum) == 0:
        return -1
    
    if float(currentNum[0]['COUNT(*)']) - float(totalNum[0]['num_seat']) >= 0:
        return -2

    # if flight is 80% full, price is 1.25x base price
    if float(currentNum[0]['COUNT(*)']) >= float(totalNum[0]['num_seat']) * 0.8:
        query = "SELECT base_price * 1.25 AS price FROM Flight WHERE flight_number = :flight_number AND dept_date_time = :dept_date_time AND airline_name = :airline_name"
    else :
        query = "SELECT base_price AS price FROM Flight WHERE flight_number = :flight_number AND dept_date_time = :dept_date_time AND airline_name = :airline_name"
    price = db.execute(query, {"flight_number": flight_number, "dept_date_time": dept_date_time, "airline_name": airline_name}, fetch=True)
    return price[0]['price']

def get_month_spending(start_date, end_date):
    # for each month between start_date and end_date, get the total spending
    # return a list of tuples (month, spending)
    # start_date and end_date are in the format of "YYYY-MM-DD"

    # parse start_date and end_date
    start_year, start_month, start_day = start_date.split("-")
    end_year, end_month, end_day = end_date.split("-")

    # get the number of months between start_date and end_date
    num_months = (int(end_year) - int(start_year)) * 12 + (int(end_month) - int(start_month)) + 1

    email = session['customer_email']

    # get the spending for each month
    spending = []
    for i in range(num_months):
        # get the start and end date of the current month
        year = int(start_year) + int((int(start_month) + i - 1) / 12)
        month = (int(start_month) + i - 1) % 12 + 1
        if i == 0:
            start_date = str(year) + "-" + str(month) + "-" + start_day
        else:
            start_date = str(year) + "-" + str(month) + "-01"
        # if not the last month, end date is the last day of the month, which varies by month
        end_date = str(year) + "-" + str(month) + "-" + str(monthrange(year, month)[1])
        if i == num_months - 1:
            end_date = end_year + "-" + end_month + "-" + end_day

        print(start_date, end_date)
        
        # get the spending for the current month
        query = "SELECT SUM(price) AS spending FROM Ticket WHERE email = :email AND purchase_date_time >= :start_date AND purchase_date_time <= :end_date"
        result = db.execute(query, {"start_date": start_date, "end_date": end_date, "email": email}, fetch=True)
        spending.append((start_date, result[0]['spending']))
    
    return spending

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
        return jsonify({"success": True, "email": session['customer_email'], "role": "customer", "first_name": session['first_name'], "last_name": session['last_name'], "date_of_birth": session['date_of_birth'], "passport_number": session['passport_number']})
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
        session['date_of_birth'] = result[0]['date_of_birth']
        session['passport_number'] = result[0]['passport_number']
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Invalid email or password"})

@app.route("/customer/register", methods=["POST"])
def customer_register():
    query = """INSERT INTO Customer (
        email, password, first_name, last_name, building, street_name, apt_number, city,
        state, zipcode, passport_number, passport_expiration, passport_country, date_of_birth
    ) VALUES (
        :email, :password, :first_name, :last_name, :building, :street_name, :apt_number, :city,
        :state, :zipcode, :passport_number, :passport_expiration, :passport_country, :date_of_birth
    )"""

    email = request.json.get("email")
    password = request.json.get("password")
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")
    building = request.json.get("building")
    street_name = request.json.get("street_name")
    apt_number = request.json.get("apt_number")
    city = request.json.get("city")
    state = request.json.get("state")
    zipcode = request.json.get("zipcode")
    passport_number = request.json.get("passport_number")
    passport_expiration = request.json.get("passport_expiration")
    passport_country = request.json.get("passport_country")
    date_of_birth = request.json.get("date_of_birth")

    try:
        result = db.execute(query, {
            "email": email, "password": password, "first_name": first_name, "last_name": last_name,
            "building": building, "street_name": street_name, "apt_number": apt_number, "city": city,
            "state": state, "zipcode": zipcode, "passport_number": passport_number,
            "passport_expiration": passport_expiration, "passport_country": passport_country,
            "date_of_birth": date_of_birth
        })
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
    Non-Auth Needed Action Related
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
        valid_flights = []
        for flight in result:
            validCheck = float(get_ticket_price(flight['flight_number'], flight['dept_date_time'], flight['airline_name']))
            if validCheck > 0:
                flight['price'] = validCheck
                valid_flights.append(flight)
            else:
                continue
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": "database error"})
    return jsonify({"success": True, "flights": valid_flights})

@app.route("/search/round-trip", methods=["GET"])
def search_roundtrip():
    dept_query = "SELECT * FROM Flight WHERE dept_airport = :dept_airport AND arrival_airport = :arrival_airport AND (dept_date_time BETWEEN :dept_date AND :dept_date_next_day)"
    return_query = "SELECT * FROM Flight WHERE dept_airport = :arrival_airport AND arrival_airport = :dept_airport AND (dept_date_time BETWEEN :return_date AND :return_date_next_day)"

    dept_date = request.args.get("dept_date")
    return_date = request.args.get("return_date")
    dept_airport = request.args.get("dept_airport")
    arrival_airport = request.args.get("arrival_airport")
    # Convert date in the format of YYYY-MM-DD to mysql datetime format
    dept_date_next_day = dept_date + " 23:59:59"
    dept_date = dept_date + " 00:00:00"
    return_date_next_day = return_date + " 23:59:59"
    return_date = return_date + " 00:00:00"

    try:
        dept_result = db.execute(dept_query, {"dept_airport": dept_airport, 
                                "arrival_airport": arrival_airport, 
                                "dept_date": dept_date, 
                                "dept_date_next_day": dept_date_next_day},
                        fetch=True)
        return_result = db.execute(return_query, {"dept_airport": dept_airport, 
                                "arrival_airport": arrival_airport, 
                                "return_date": return_date, 
                                "return_date_next_day": return_date_next_day},
                        fetch=True)
        if len(dept_result) == 0 or len(return_result) == 0:
            return jsonify({"success": False, "error": "No flight found for the roundtrip"})
        for flight in dept_result:
            flight['price'] = float(get_ticket_price(flight['flight_number'], flight['dept_date_time'], flight['airline_name']))
        for flight in return_result:
            flight['price'] = float(get_ticket_price(flight['flight_number'], flight['dept_date_time'], flight['airline_name']))
        return jsonify({"success": True, "dept_flights": dept_result, "return_flights": return_result})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": "database error"})

@app.route("/search/status", methods=["GET"])
def search_status():
    airline_name = request.args.get("airline_name")
    flight_number = request.args.get("flight_number")
    dept_date_time = request.args.get("dept_date_time")
    arrival_date_time = request.args.get("arrival_date_time")
    if dept_date_time is None:
        arrival_date_next_day = arrival_date_time + " 23:59:59"
        arrival_date_time = arrival_date_time + " 00:00:00"
        query = "SELECT * FROM Flight WHERE airline_name = :airline_name AND flight_number = :flight_number AND arrival_date_time BETWEEN :arrival_date_time AND :arrival_date_next_day"

        try:
            result = db.execute(query, {"airline_name": airline_name,
                                    "flight_number": flight_number,
                                    "arrival_date_time": arrival_date_time,
                                    "arrival_date_next_day": arrival_date_next_day},
                            fetch=True)
            if len(result) == 0:
                return jsonify({"success": False, "error": "No flight found"})
            return jsonify({"success": True, "flights": result})
        except Exception as e:
            print(e)
            return jsonify({"success": False, "error": "database error"})
    else:
        dept_date_next_day = dept_date_time + " 23:59:59"
        dept_date_time = dept_date_time + " 00:00:00"
        query = "SELECT * FROM Flight WHERE airline_name = :airline_name AND flight_number = :flight_number AND dept_date_time BETWEEN :dept_date_time AND :dept_date_next_day"
        
        try:
            result = db.execute(query, {"airline_name": airline_name,
                                    "flight_number": flight_number,
                                    "dept_date_time": dept_date_time,
                                    "dept_date_next_day": dept_date_next_day},
                            fetch=True)
            if len(result) == 0:
                return jsonify({"success": False, "error": "No flight found"})
            return jsonify({"success": True, "flights": result})
        except Exception as e:
            print(e)
            return jsonify({"success": False, "error": "database error"})
        

'''
    Customer Auth Needed Action Related
'''
@app.route("/customer/flights", methods=["GET"])
@customer_login_required
def get_customer_flights():
    query = '''
        SELECT Flight.*, Ticket.id, Ticket.price, Ticket.first_name, Ticket.last_name
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

@app.route("/customer/rate", methods=["POST"])
@customer_login_required
def rate_flight():
    # Check if the customer has already rated the flight
    check = '''
        SELECT * FROM Rate
        WHERE email = :email AND airline_name = :airline_name AND flight_number = :flight_number AND dept_date_time = :dept_date_time
    '''

    email = session['customer_email']
    airline_name = request.json.get("airline_name")
    flight_number = request.json.get("flight_number")
    dept_date_time = datetime.strptime(request.json.get("dept_date_time"), "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d %H:%M:%S")
    rating = request.json.get("rating")
    comment = request.json.get("comment")

    try:
        result = db.execute(check, {"email": email, "airline_name": airline_name, "flight_number": flight_number, "dept_date_time": dept_date_time}, 
                            fetch=True)
        if len(result) > 0:
            query = '''
                UPDATE Rate
                SET rating = :rating, comment = :comment
                WHERE email = :email AND airline_name = :airline_name AND flight_number = :flight_number AND dept_date_time = :dept_date_time
            '''
        else:
            query = '''
                INSERT INTO Rate (email, airline_name, flight_number, dept_date_time, rating, comment)
                VALUES (:email, :airline_name, :flight_number, :dept_date_time, :rating, :comment)
            '''
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": "database error"})

    try:
        db.execute(query, {"email": email, "airline_name": airline_name, "flight_number": flight_number, "dept_date_time": dept_date_time, "rating": rating, "comment": comment})
        return jsonify({"success": True})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": "database error"})

@app.route("/customer/purchase", methods=["POST"])
@customer_login_required
def purchase_ticket():
    query = '''
        INSERT INTO Ticket (
            email, purchase_date_time, airline_name, flight_number, dept_date_time,
            card_type, card_number, name_card, card_expiration, price, first_name, last_name, date_of_birth, passport_number
        ) VALUES (
            :email, :purchase_date_time, :airline_name, :flight_number, :dept_date_time,
            :card_type, :card_number, :card_name, :card_expiration, :price, :first_name, :last_name, :date_of_birth, :passport_number
        )
    '''

    email = session['customer_email']
    purchase_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    airline_name = request.json.get("airline_name")
    flight_number = request.json.get("flight_number")
    dept_date_time = datetime.strptime(request.json.get("dept_date_time"), "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d %H:%M:%S")
    card_type = request.json.get("card_type")
    card_number = request.json.get("card_number")
    card_name = request.json.get("card_name")
    card_expiration = request.json.get("card_expiration")
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")
    date_of_birth = request.json.get("date_of_birth")
    passport_number = request.json.get("passport_number")
    price = get_ticket_price(flight_number, dept_date_time, airline_name)
    
    try:
        db.execute(query, {
            "email": email, "purchase_date_time": purchase_time,
            "airline_name": airline_name, "flight_number": flight_number, "dept_date_time": dept_date_time,
            "card_type": card_type, "card_number": card_number, "card_name": card_name,
            "card_expiration": card_expiration, "price": price, "first_name": first_name, "last_name": last_name, "date_of_birth": date_of_birth, "passport_number": passport_number
        })
        return jsonify({"success": True})
    except sqlalchemy.exc.IntegrityError as e:
        return jsonify({"success": False, "error": "duplicate ticket"})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})

@app.route("/customer/cancel", methods=["POST"])
@customer_login_required
def cancel_ticket():
    query = '''
        DELETE FROM Ticket
        WHERE id = :id
    '''

    id = request.json.get("id")

    try:
        db.execute(query, {"id": id})
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})

@app.route("/customer/spending", methods=["GET"])
@customer_login_required
def get_spending():
    print("here")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    print(start_date, end_date)
    try:
        result = get_month_spending(start_date, end_date)
        print(result)
        result = [{"month": month[:-3], "spending": float(spending) if spending is not None else 0.0} for month, spending in result]
        return jsonify({"success": True, "spending": result})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": "database error"})


if __name__ == "__main__":
    app.run(debug=True)