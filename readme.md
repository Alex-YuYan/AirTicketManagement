# Air Ticket Management System
A Air Ticket Management System WebApp. It is developed using Flask + ReactJS + MySQL.
## Runnning the application
1. Clone the repository
2. Make sure you have python 3 and nodejs installed
3. Make sure you have MySQL installed
4. Create a database named `flightmgr`
5. Run the `create_schema.sql` file in the `Database` folder
6. Install the backend dependencies
```
pip install -r requirements.txt
```
7. Configure the database connection in `Backend/app.py`
```
app.config.from_mapping(
    DB_NAME="flightmgr", # change this to your database name
    DB_USER="root", # change this to your database user
    DB_PASSWORD="root", # change this to your database password
    DB_HOST="127.0.0.1", # change this to your database host
    DB_PORT="8889", # change this to your database port
)
```
8. Start the backend
```
python app.py
```
9. Install the dependencies for the frontend
```
npm install
```
10. Run the frontend in development mode
```
npm run dev
```

11. Open the browser and go to the url Vite provides in the terminal