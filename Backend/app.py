from datetime import datetime, time, timedelta
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

states = ['new york', 'new jersey', 'california', 'texas', 'florida', 'illinois', 'pennsylvania', 'ohio', 'georgia', 'michigan', 'north carolina', 'virginia', 'washington', 'arizona', 'massachusetts', 'indiana', 'tennessee', 'missouri', 'maryland', 'wisconsin', 'minnesota', 'colorado', 'alabama', 'south carolina', 'louisiana', 'kentucky', 'oregon', 'oklahoma', 'connecticut', 'utah', 'iowa', 'mississippi', 'arkansas', 'kansas', 'nevada', 'new mexico', 'nebraska', 'west virginia', 'idaho', 'hawaii', 'new hampshire', 'maine', 'rhode island', 'montana', 'delaware', 'south dakota', 'north dakota', 'alaska', 'wyoming', 'district of columbia', 'puerto rico', 'virgin islands', 'guam', 'american samoa', 'northern mariana islands']


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
            start_date = str(year) + "-" + str(month) + "-" + start_day + " 00:00:00"
        else:
            start_date = str(year) + "-" + str(month) + "-01" + " 00:00:00"
        # if not the last month, end date is the last day of the month, which varies by month
        end_date = str(year) + "-" + str(month) + "-" + str(monthrange(year, month)[1]) + " 23:59:59"
        if i == num_months - 1:
            end_date = end_year + "-" + end_month + "-" + end_day + " 23:59:59"
        
        # get the spending for the current month
        query = "SELECT SUM(price) AS spending FROM Ticket WHERE email = :email AND purchase_date_time >= :start_date AND purchase_date_time <= :end_date"
        result = db.execute(query, {"start_date": start_date, "end_date": end_date, "email": email}, fetch=True)
        spending.append((start_date, result[0]['spending']))
    
    return spending

def get_month_sold(airline_name, start_date, end_date):
    # for each month between start_date and end_date, get the total number of tickets sold
    # return a list of tuples (month, num_sold)
    # start_date and end_date are in the format of "YYYY-MM-DD"

    # parse start_date and end_date
    start_year, start_month, start_day = start_date.split("-")
    end_year, end_month, end_day = end_date.split("-")

    # get the number of months between start_date and end_date
    num_months = (int(end_year) - int(start_year)) * 12 + (int(end_month) - int(start_month)) + 1

    # get the number of tickets sold for each month
    num_sold = []
    for i in range(num_months):
        # get the start and end date of the current month
        year = int(start_year) + int((int(start_month) + i - 1) / 12)
        month = (int(start_month) + i - 1) % 12 + 1
        if i == 0:
            start_date = str(year) + "-" + str(month) + "-" + start_day + " 00:00:00"
        else:
            start_date = str(year) + "-" + str(month) + "-01" + " 00:00:00"
        # if not the last month, end date is the last day of the month, which varies by month
        end_date = str(year) + "-" + str(month) + "-" + str(monthrange(year, month)[1]) + " 23:59:59"
        if i == num_months - 1:
            end_date = end_year + "-" + end_month + "-" + end_day + " 23:59:59"
        
        # get the number of tickets sold for the current month
        query = "SELECT COUNT(*) AS num_sold FROM Ticket WHERE purchase_date_time >= :start_date AND purchase_date_time <= :end_date AND airline_name = :airline_name"
        result = db.execute(query, {"start_date": start_date, "end_date": end_date, "airline_name": airline_name}, fetch=True)
        num_sold.append((start_date[:-12], result[0]['num_sold']))
    
    return num_sold

def get_airport_name(code):
    query = "SELECT name FROM Airport WHERE code = :code"
    result = db.execute(query, {"code": code}, fetch=True)
    return result[0]['name']

def get_city_name(code):
    query = "SELECT city FROM Airport WHERE code = :code"
    result = db.execute(query, {"airport_code": code}, fetch=True)
    return result[0]['city']


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
        return jsonify({"success": True, "username": session['staff_username'], "role": "staff", "first_name": session['first_name'], "last_name": session['last_name'], "airline_name": session['airline_name']})
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

@app.route("/staff/login", methods=["POST"])
def staff_login():
    query = "SELECT * FROM Staff WHERE username = :username AND password = :password"

    username = request.json.get("username")
    password = request.json.get("password")

    try:
        result = db.execute(query, {"username": username, "password": password}, fetch=True)
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})
    if len(result) == 1:
        session['staff_username'] = result[0]['username']
        session['first_name'] = result[0]['first_name']
        session['last_name'] = result[0]['last_name']
        session['airline_name'] = result[0]['airline_name']
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Invalid username or password"})

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
    phone_numbers = request.json.get("phone_numbers")

    if not email or not password or not first_name or not last_name or not building or not street_name or not city or not state or not zipcode or not passport_number or not passport_expiration or not passport_country or not date_of_birth or not phone_numbers:
        return jsonify({"success": False, "error": "Missing required information"})

    if state.lower() not in states:
        return jsonify({"success": False, "error": "Invalid state"})

    try:
        db.execute(query, {
            "email": email, "password": password, "first_name": first_name, "last_name": last_name,
            "building": building, "street_name": street_name, "apt_number": apt_number, "city": city,
            "state": state, "zipcode": zipcode, "passport_number": passport_number,
            "passport_expiration": passport_expiration, "passport_country": passport_country,
            "date_of_birth": date_of_birth
        })

        for phone_number in phone_numbers:
            query = "INSERT INTO Customer_Phone (email, phone_number) VALUES (:email, :phone_number)"
            db.execute(query, {"email": email, "phone_number": phone_number})
    except sqlalchemy.exc.IntegrityError as e:
        print(e)
        return jsonify({"success": False, "error": "Email already exists, please just login"})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})
    
    return jsonify({"success": True})

@app.route("/staff/register", methods=["POST"])
def staff_register():
    username = request.json.get("username")
    password = request.json.get("password")
    first_name = request.json.get("first_name")
    last_name = request.json.get("last_name")
    airline_name = request.json.get("airline_name")
    date_of_birth = request.json.get("date_of_birth")
    phone_numbers = request.json.get("phone_numbers")
    emails = request.json.get("emails")

    query = """INSERT INTO Staff (
        username, password, first_name, last_name, airline_name, date_of_birth
    ) VALUES (
        :username, :password, :first_name, :last_name, :airline_name, :date_of_birth
    )"""

    if not username or not password or not first_name or not last_name or not airline_name or not date_of_birth or not emails:
        return jsonify({"success": False, "error": "Missing required information"})
    
    try:
        db.execute(query, {
            "username": username, "password": password, "first_name": first_name, "last_name": last_name,
            "airline_name": airline_name, "date_of_birth": date_of_birth
        })

        if phone_numbers:
            for phone_number in phone_numbers:
                query = "INSERT INTO Staff_Phone (username, phone) VALUES (:username, :phone_number)"
                db.execute(query, {"username": username, "phone_number": phone_number})
        
        for email in emails:
            query = "INSERT INTO Staff_Email (username, email) VALUES (:username, :email)"
            db.execute(query, {"username": username, "email": email})

    except sqlalchemy.exc.IntegrityError as e:
        print(e)
        return jsonify({"success": False, "error": "Username already exists, or airline name does not exist"})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})
    
    return jsonify({"success": True})

@app.route("/staff/logout", methods=["POST"])
@staff_login_required
def staff_logout():
    try:
        session.clear()
    except Exception as e:
        return jsonify({"success": False})
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

@app.route("/list/airports", methods=["GET"])
def list_airports():
    query = "SELECT * FROM Airport"
    try:
        result = db.execute(query, fetch=True)
        return jsonify({"success": True, "airports": result})
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
        print(e)
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
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    try:
        result = get_month_spending(start_date, end_date)
        result = [{"month": month[:-12], "spending": float(spending) if spending is not None else 0.0} for month, spending in result]
        return jsonify({"success": True, "spending": result})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": "database error"})

'''
    Staff Auth Needed Action Related
'''
@app.route("/staff/flights", methods=["GET"])
@staff_login_required
def get_flights():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    airline_name = session['airline_name']
    source = request.args.get("source")
    destination = request.args.get("destination")

    start_date = start_date + " 00:00:00"
    end_date = end_date + " 23:59:59"

    try:
        if len(source) > 0 and len(destination) > 0:
            query = '''
                SELECT * FROM Flight
                WHERE airline_name = :airline_name AND dept_date_time >= :start_date AND dept_date_time <= :end_date AND dept_airport = :source AND arrival_airport = :destination
            '''
        elif len(source) > 0:
            query = '''
                SELECT * FROM Flight
                WHERE airline_name = :airline_name AND dept_date_time >= :start_date AND dept_date_time <= :end_date AND dept_airport = :source
            '''
        elif len(destination) > 0:
            query = '''
                SELECT * FROM Flight
                WHERE airline_name = :airline_name AND dept_date_time >= :start_date AND dept_date_time <= :end_date AND arrival_airport = :destination
            '''
        else:
            query = '''
                SELECT * FROM Flight
                WHERE airline_name = :airline_name AND dept_date_time >= :start_date AND dept_date_time <= :end_date
            '''
        result = db.execute(query, {"airline_name": airline_name, "start_date": start_date, "end_date": end_date, "source": source, "destination": destination}, fetch=True)
        result = [dict(row) for row in result]
        for each in result:
            each['dept_airport'] = get_airport_name(each['dept_airport'])
            each['arrival_airport'] = get_airport_name(each['arrival_airport'])
        print(result)
        return jsonify({"success": True, "flights": result})
    except Exception as e:
        print(e)
        return jsonify({"success": False, "error": "database error"})

@app.route("/staff/airports", methods=["POST"])
@staff_login_required
def add_airport():
    code = request.json.get("code")
    name = request.json.get("name")
    city = request.json.get("city")
    country = request.json.get("country")
    types = request.json.get("type")

    if not code or not name or not city or not country or not types:
        return jsonify({"success": False, "error": "missing field"})

    query = '''
        INSERT INTO Airport (code, name, city, country)
        VALUES (:code, :name, :city, :country)
    '''

    queryTypes = '''
        INSERT INTO Airport_Type (code, type)
        VALUES (:code, :type)
    '''

    try:
        db.execute(query, {"code": code, "name": name, "city": city, "country": country})
        for each in types:
            db.execute(queryTypes, {"code": code, "type": each})
        return jsonify({"success": True})
    except sqlalchemy.exc.IntegrityError as e:
        return jsonify({"success": False, "error": "duplicate airport"})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})

@app.route("/staff/airplane", methods=["POST"])
@staff_login_required
def add_airplane():
    airplane_id = request.json.get("airplane_id")
    airline_name = session['airline_name']
    num_seat = request.json.get("num_seat")
    manufacturer = request.json.get("manufacturer")
    manufacture_date = request.json.get("manufacture_date")

    if not airplane_id or not num_seat or not manufacturer or not manufacture_date:
        return jsonify({"success": False, "error": "missing field"})
    
    query = '''
        INSERT INTO Airplane (airplane_id, airline_name, num_seat, manufacturer, manufacture_date)
        VALUES (:airplane_id, :airline_name, :num_seat, :manufacturer, :manufacture_date)
    '''

    try:
        db.execute(query, {"airplane_id": airplane_id, "airline_name": airline_name, "num_seat": num_seat, "manufacturer": manufacturer, "manufacture_date": manufacture_date})
        return jsonify({"success": True})
    except sqlalchemy.exc.IntegrityError as e:
        return jsonify({"success": False, "error": "duplicate airplane"})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})

@app.route("/staff/airplane", methods=["GET"])
@staff_login_required
def get_airplane():
    airline_name = session['airline_name']
    query = '''
        SELECT * FROM Airplane
        WHERE airline_name = :airline_name
    '''
    try:
        result = db.execute(query, {"airline_name": airline_name}, fetch=True)
        # return all ids
        result = [row['airplane_id'] for row in result]
        return jsonify({"success": True, "airplanes": result})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})

@app.route("/staff/flights", methods=["POST"])
@staff_login_required
def add_flight():
    airline_name = session['airline_name']
    flight_number = request.json.get("flight_number")
    dept_date_time = request.json.get("dept_date_time")
    airplane_id = request.json.get("airplane_id")
    arrival_date_time = request.json.get("arrival_date_time")
    base_price = request.json.get("base_price")
    status = request.json.get("status")
    dept_airport = request.json.get("dept_airport")
    arrival_airport = request.json.get("arrival_airport")

    if not flight_number or not dept_date_time or not airplane_id or not arrival_date_time or not base_price or not status or not dept_airport or not arrival_airport:
        return jsonify({"success": False, "error": "missing field"})
    
    dept_date_time = datetime.strptime(dept_date_time, '%Y-%m-%dT%H:%M')
    dept_date_time = dept_date_time.strftime('%Y-%m-%d %H:%M:%S')
    arrival_date_time = datetime.strptime(arrival_date_time, '%Y-%m-%dT%H:%M')
    arrival_date_time = arrival_date_time.strftime('%Y-%m-%d %H:%M:%S')
    
    query = '''
        INSERT INTO Flight (airline_name, flight_number, dept_date_time, airplane_id, arrival_date_time, base_price, status, dept_airport, arrival_airport)
        VALUES (:airline_name, :flight_number, :dept_date_time, :airplane_id, :arrival_date_time, :base_price, :status, :dept_airport, :arrival_airport)
    '''

    try:
        db.execute(query, {"airline_name": airline_name, "flight_number": flight_number, "dept_date_time": dept_date_time, "airplane_id": airplane_id, "arrival_date_time": arrival_date_time, "base_price": base_price, "status": status, "dept_airport": dept_airport, "arrival_airport": arrival_airport})
        return jsonify({"success": True})
    except sqlalchemy.exc.IntegrityError as e:
        return jsonify({"success": False, "error": "duplicate flight"})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})

@app.route("/staff/changeFlightStatus", methods=["POST"])
@staff_login_required
def change_flight_status():
    airline_name = session['airline_name']
    flight_number = request.json.get("flight_number")
    dept_date_time = request.json.get("dept_date_time")

    if not flight_number or not dept_date_time:
        return jsonify({"success": False, "error": "missing field"})

    dept_date_time = datetime.strptime(dept_date_time, '%a, %d %b %Y %H:%M:%S %Z')
    dept_date_time = dept_date_time.strftime('%Y-%m-%d %H:%M:%S')

    try:
        query = "SELECT * FROM Flight WHERE airline_name = :airline_name AND flight_number = :flight_number AND dept_date_time = :dept_date_time"
        result = db.execute(query, {"airline_name": airline_name, "flight_number": flight_number, "dept_date_time": dept_date_time}, fetch=True)
        if len(result) == 0:
            return jsonify({"success": False, "error": "flight not found"})
        else:
            if result[0]["status"] == 'on-time':
                query = "UPDATE Flight SET status = 'delayed' WHERE airline_name = :airline_name AND flight_number = :flight_number AND dept_date_time = :dept_date_time"
                db.execute(query, {"airline_name": airline_name, "flight_number": flight_number, "dept_date_time": dept_date_time})
                return jsonify({"success": True, "status": "delayed"})
            elif result[0]["status"] == 'delayed':
                query = "UPDATE Flight SET status = 'on-time' WHERE airline_name = :airline_name AND flight_number = :flight_number AND dept_date_time = :dept_date_time"
                db.execute(query, {"airline_name": airline_name, "flight_number": flight_number, "dept_date_time": dept_date_time})
                return jsonify({"success": True, "status": "on-time"})
            else:
                return jsonify({"success": False, "error": "invalid status"})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})

@app.route("/staff/getAllCustomers", methods=["GET"])
@staff_login_required
def get_all_customers():
    airline_name = session['airline_name']
    flight_number = request.args.get("flight_number")
    dept_date_time = request.args.get("dept_date_time")

    if not flight_number or not dept_date_time:
        return jsonify({"success": False, "error": "missing field"})

    dept_date_time = datetime.strptime(dept_date_time, '%a, %d %b %Y %H:%M:%S %Z')
    dept_date_time = dept_date_time.strftime('%Y-%m-%d %H:%M:%S')

    try:
        query = '''
            SELECT * FROM Customer
            WHERE email IN (
                SELECT email FROM Ticket
                WHERE airline_name = :airline_name AND flight_number = :flight_number AND dept_date_time = :dept_date_time
            )
        '''
        result = db.execute(query, {"airline_name": airline_name, "flight_number": flight_number, "dept_date_time": dept_date_time}, fetch=True)
        return jsonify({"success": True, "customers": result})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})
    
@app.route("/staff/getRatings", methods=["GET"])
@staff_login_required
def get_ratings():
    airline_name = session['airline_name']
    flight_number = request.args.get("flight_number")
    dept_date_time = request.args.get("dept_date_time")

    if not flight_number or not dept_date_time:
        return jsonify({"success": False, "error": "missing field"})

    dept_date_time = datetime.strptime(dept_date_time, '%a, %d %b %Y %H:%M:%S %Z')
    dept_date_time = dept_date_time.strftime('%Y-%m-%d %H:%M:%S')

    try:
        query = '''
            SELECT * FROM Rate
            WHERE airline_name = :airline_name AND flight_number = :flight_number AND dept_date_time = :dept_date_time
        '''
        result = db.execute(query, {"airline_name": airline_name, "flight_number": flight_number, "dept_date_time": dept_date_time}, fetch=True)
        if len(result) == 0:
            return jsonify({"success": True, "ratings": [], "avg_rating": -1})
        avg_rating = 0
        for rating in result:
            avg_rating += int(rating['rating'])
        avg_rating /= len(result)
        return jsonify({"success": True, "ratings": result, "avg_rating": avg_rating})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})

@app.route("/staff/getFreqCustomers", methods=["GET"])
@staff_login_required
def get_freq_customers():
    airline_name = session['airline_name']

    # Get purchase within last year
    a_year_ago = datetime.now() - timedelta(days=365)
    a_year_ago = a_year_ago.strftime('%Y-%m-%d %H:%M:%S')
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    query = '''
        SELECT email, COUNT(*) AS num_tickets FROM Ticket
        WHERE airline_name = :airline_name AND dept_date_time BETWEEN :a_year_ago AND :now
        GROUP BY email
        ORDER BY num_tickets DESC
    '''
    try:
        result = db.execute(query, {"airline_name": airline_name, "a_year_ago": a_year_ago, "now": now}, fetch=True)
        nameQuery = '''
            SELECT first_name, last_name FROM Customer
            WHERE email = :email
        '''
        for customer in result:
            name = db.execute(nameQuery, {"email": customer['email']}, fetch=True)
            customer['first_name'] = name[0]['first_name']
            customer['last_name'] = name[0]['last_name']
        return jsonify({"success": True, "customers": result})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})
    
@app.route("/staff/getRevenue", methods=["GET"])
@staff_login_required
def get_revenue():
    airline_name = session['airline_name']
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    if not start_date or not end_date:
        return jsonify({"success": False, "error": "missing field"})
    
    start_date = start_date + " 00:00:00"
    end_date = end_date + " 23:59:59"

    try:
        query = '''
            SELECT SUM(price) AS revenue FROM Ticket
            WHERE airline_name = :airline_name AND purchase_date_time BETWEEN :start_date AND :end_date
        '''
        result = db.execute(query, {"airline_name": airline_name, "start_date": start_date, "end_date": end_date}, fetch=True)
        return jsonify({"success": True, "revenue": result[0]['revenue']})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})
    
@app.route("/staff/getTicketSoldMonthly", methods=["GET"])
@staff_login_required
def get_tickets_sold_monthly():
    airline_name = session['airline_name']
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    if not start_date or not end_date:
        return jsonify({"success": False, "error": "missing field"})
    
    try:
        result = get_month_sold(airline_name, start_date, end_date)
        return jsonify({"success": True, "tickets_sold": result})
    except Exception as e:
        return jsonify({"success": False, "error": "database error"})

if __name__ == "__main__":
    app.run(debug=True)