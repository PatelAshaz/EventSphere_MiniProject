# Campus Tech Club & Event Management Hub — Backend Setup Guide
**College Mini-Project (2nd-Year Computer Engineering)**

Built using **Core Java Servlets**, **Standard JDBC**, **MySQL**, and **Google Gson**.

---

## 📁 Project Structure

```text
backend/
├── schema.sql                      <- MySQL database schema & sample seed data
├── WebContent/
│   └── WEB-INF/
│       ├── web.xml                 <- Deployment descriptor for Apache Tomcat
│       └── lib/                    <- Put the 2 required JAR files here:
│           ├── mysql-connector-j-8.x.jar
│           └── gson-2.10.1.jar
└── src/
    └── com/campushub/
        ├── model/
        │   ├── Event.java          <- Model class with getters and setters
        │   └── Registration.java   <- Model class with getters and setters
        ├── util/
        │   └── DBConnection.java   <- Raw JDBC connection (DriverManager.getConnection)
        └── servlet/
            ├── CorsFilter.java     <- Filter to allow React frontend (port 5173)
            ├── EventServlet.java   <- GET /api/events, POST /api/events
            └── RegisterServlet.java<- POST /api/register, GET /api/register
```

---

## 🗄️ Step 1: Set Up MySQL Database

1. Open MySQL Workbench or your terminal.
2. Run the SQL script `schema.sql`:
   ```bash
   mysql -u root -p < schema.sql
   ```
   Or open `schema.sql` in MySQL Workbench and execute all statements (`Ctrl + Shift + Enter`).
3. Check `DBConnection.java`:
   - Default credentials are set to:
     - URL: `jdbc:mysql://localhost:3306/campus_event_db`
     - Username: `root`
     - Password: `password`
   - If your MySQL password is different, change `PASSWORD` in `DBConnection.java`.

---

## 📦 Step 2: Download the 2 Required JAR Files

You only need **two external JARs** (no heavy frameworks!):
1. **MySQL Connector/J**: [Download JAR](https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.3.0/mysql-connector-j-8.3.0.jar)
2. **Google Gson**: [Download JAR](https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar)

> **Where to put them:**
> - In **Eclipse**: Place both `.jar` files in `WebContent/WEB-INF/lib/` (or right-click project -> Build Path -> Add External Archives).
> - In **Tomcat**: You can also drop both JARs inside Tomcat's `lib/` folder.

---

## 🚀 Step 3: Run on Apache Tomcat

1. In Eclipse:
   - File -> **New** -> **Dynamic Web Project**.
   - Project Name: `CampusHub` (This makes the context path `/CampusHub` to match `App.jsx`).
   - Copy the `src/` folder and `WebContent/` into the project.
   - Right-click project -> **Run As** -> **Run on Server** -> Select Apache Tomcat 10.x / 10.1.x.
2. The server will start at `http://localhost:8080/CampusHub`.

> 💡 **Tomcat 9 vs Tomcat 10 Note:**
> - **Tomcat 10 / 11** uses `jakarta.servlet.*` (which is what this project uses).
> - If your college lab runs **Tomcat 9 or 8.5**, simply change `jakarta.servlet` to `javax.servlet` at the top of the 3 Servlet/Filter files.

---

## 🌐 Step 4: Run the React Frontend

In another terminal, start the React frontend:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The frontend will immediately fetch the live events from your Java Servlet backend!

---

## 🧪 API Endpoints Reference

| Method | Endpoint | Description | Sample Request / Response |
|--------|----------|-------------|---------------------------|
| `GET` | `/api/events` | Fetch all tech club events | Returns JSON array of events |
| `POST` | `/api/events` | Add a new event (Admin) | Send `{ "title": "...", "date": "...", "venue": "..." }` |
| `POST` | `/api/register` | Register a student for an event | Send `{ "name": "...", "rollNo": "...", "eventId": "..." }` |
| `GET` | `/api/register` or `/api/registrations` | View all registered students | Returns JSON array of student registrations |
