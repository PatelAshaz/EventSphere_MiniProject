# Campus Tech Club & Event Management Hub

> **Abstract** : This project is a full-stack web application designed to centralize and manage university tech club activities, coding challenges, and campus events. The platform is built using a React.js frontend for a dynamic user interface, Java Servlets for backend RESTful API handling, and a MySQL database for persistent data storage. Key features include a student-facing interactive event calendar, seamless registration for upcoming hackathons and quizzes, and a dedicated administrator dashboard for club leaders to manage event schedules, track attendee registrations, and update event leaderboards. By bridging the gap between organizers and participants, this system streamlines campus tech community engagement into a single, cohesive platform.

### Project Members

1. SHAIKH KASHIF MOHAMMED KALAM [ Team Leader ]
2. NAGARGOJE PRITAM DATTATRAY
3. CHOUDHARY IBRAR AHMED TASAWWAR HUSAIN
4. PATEL ASHAZ SHAKIR
5. CHOUDHARY MOHD ARMAN MOHD SALIM

### Project Guides

Prof.Shiburaj

### Deployment Steps

Please follow the below steps to run this project:

1. **Set Up the MySQL Database**
   - Open MySQL Workbench or your terminal.
   - Run the provided `schema.sql` script to create the schema and initial seed data:
     ```bash
     mysql -u root -p < backend/schema.sql
     ```
   - Verify that your database credentials match `backend/src/com/campushub/util/DBConnection.java` (Default URL: `jdbc:mysql://localhost:3306/campus_event_db`, user: `root`).

2. **Download Required Backend JAR Dependencies**
   - Download the required dependencies:
     - [MySQL Connector/J 8.x](https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.3.0/mysql-connector-j-8.3.0.jar)
     - [Google Gson 2.10.1](https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar)
   - Place both `.jar` files into the `backend/WebContent/WEB-INF/lib/` folder (or add them via Eclipse Build Path: *Project Properties -> Java Build Path -> Add External JARs*).

3. **Deploy Backend on Apache Tomcat**
   - Open Eclipse IDE for Enterprise Java and Web Developers.
   - Create a **Dynamic Web Project** named `CampusHub` (context path `/CampusHub`).
   - Copy the `src/` and `WebContent/` contents into your Eclipse project directory.
   - Right-click the project -> **Run As** -> **Run on Server** -> Select **Apache Tomcat 10.x / 10.1.x**.
   - The servlet backend will be running at `http://localhost:8080/CampusHub`.

4. **Run the React Frontend**
   - Open a terminal in the frontend directory.
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the Vite/React development server:
     ```bash
     npm run dev
     ```
   - Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

### Subject Details

- **Class** : SE (COMP) Div A - 2026-2027
- **Subject** : Full Stack Java Programming (FSJP)
- **Project Type** : Course Project

### Platform, Libraries and Frameworks used

1. [React.js](https://react.dev) & [Vite](https://vitejs.dev) — Frontend UI & build tool
2. [Tailwind CSS](https://tailwindcss.com) — Responsive styling
3. [Jakarta / Java Servlets](https://jakarta.ee/specifications/servlet/) — RESTful backend controller & API handling
4. [MySQL](https://www.mysql.com) & [JDBC](https://docs.oracle.com/javase/8/docs/technotes/guides/jdbc/) — Persistent relational database and connectivity
5. [Google Gson](https://github.com/google/gson) — JSON serialization and deserialization
6. [Apache Tomcat](https://tomcat.apache.org) — Web server & servlet container

### Dataset Used

1. **In-memory / Relational Seed Data**: Structured schema defined in `backend/schema.sql` containing sample campus tech events, club categories, participant entries, and registrations.

### References

- [Jakarta Servlet Specification](https://jakarta.ee/specifications/servlet/)
- [MySQL Connector/J Documentation](https://dev.mysql.com/doc/connector-j/en/)
- [React Official Documentation](https://react.dev)
- [Google Gson GitHub Repository](https://github.com/google/gson)
- [Apache Tomcat Documentation](https://tomcat.apache.org/tomcat-10.1-doc/index.html)
