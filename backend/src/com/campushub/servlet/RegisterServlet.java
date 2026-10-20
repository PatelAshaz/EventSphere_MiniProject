package com.campushub.servlet;

// Note: If using Tomcat 9 or older, replace 'jakarta.servlet' with 'javax.servlet'
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.campushub.model.Registration;
import com.campushub.util.DBConnection;
import com.google.gson.Gson;

// Servlet mapping for /api/register and /api/registrations
@WebServlet(urlPatterns = {"/api/register", "/api/registrations"})
public class RegisterServlet extends HttpServlet {

    private final Gson gson = new Gson();

    // Helper method to add CORS headers directly to responses
    private void addCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    // Handle CORS preflight OPTIONS request
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        addCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    // GET /api/register or /api/registrations -> View registered students
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Adding CORS headers so React frontend can read response
        addCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        List<Registration> regList = new ArrayList<>();

        // Optional query parameter to filter registrations by event ID
        String eventFilter = request.getParameter("eventId");
        if (eventFilter == null) {
            eventFilter = request.getParameter("event_id");
        }

        // Raw SQL query with JOIN on events table to also get the event title
        String sql;
        if (eventFilter != null && !eventFilter.trim().isEmpty() && !eventFilter.equalsIgnoreCase("all")) {
            sql = "SELECT r.id, r.student_name, r.roll_no, r.branch, r.year, r.email, r.event_id, e.title AS event_name " +
                  "FROM registrations r " +
                  "LEFT JOIN events e ON r.event_id = e.id " +
                  "WHERE r.event_id = ? " +
                  "ORDER BY r.id DESC";
        } else {
            sql = "SELECT r.id, r.student_name, r.roll_no, r.branch, r.year, r.email, r.event_id, e.title AS event_name " +
                  "FROM registrations r " +
                  "LEFT JOIN events e ON r.event_id = e.id " +
                  "ORDER BY r.id DESC";
        }

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            // Connecting to mysql database
            conn = DBConnection.getConnection();

            if (conn == null) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"error\": \"Database connection could not be established.\"}");
                return;
            }

            stmt = conn.prepareStatement(sql);
            if (eventFilter != null && !eventFilter.trim().isEmpty() && !eventFilter.equalsIgnoreCase("all")) {
                stmt.setString(1, eventFilter);
            }

            rs = stmt.executeQuery();

            // Loop through each row in ResultSet and map to Registration model
            while (rs.next()) {
                Registration reg = new Registration();
                reg.setId(rs.getInt("id"));

                String name = rs.getString("student_name");
                reg.setStudent_name(name);
                reg.setName(name); // alias for React frontend

                String rollNo = rs.getString("roll_no");
                reg.setRoll_no(rollNo);
                reg.setRollNo(rollNo); // alias for React frontend

                reg.setBranch(rs.getString("branch"));
                reg.setYear(rs.getString("year"));
                reg.setEmail(rs.getString("email"));

                String eventId = rs.getString("event_id");
                reg.setEvent_id(eventId);
                reg.setEventId(eventId); // alias for React frontend

                String eventName = rs.getString("event_name");
                reg.setEventName(eventName != null ? eventName : eventId);

                regList.add(reg);
            }

            // Converting Java ArrayList into JSON string using Gson
            String jsonResponse = gson.toJson(regList);

            // Sending json response to react
            out.print(jsonResponse);
            out.flush();

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Failed to retrieve registrations: " + e.getMessage() + "\"}");
        } finally {
            // Closing database resources
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    // POST /api/register -> Register a student for an event
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Adding CORS headers
        addCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {
            // Reading JSON body sent by React frontend
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            // Parse JSON into Registration Java object using Gson
            Registration newReg = gson.fromJson(sb.toString(), Registration.class);

            if (newReg == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"status\": \"error\", \"message\": \"Invalid JSON request body\"}");
                return;
            }

            // Extract values (handling both standard and frontend property names)
            String studentName = newReg.getName() != null ? newReg.getName().trim() : 
                                (newReg.getStudent_name() != null ? newReg.getStudent_name().trim() : "");
            String rollNo = newReg.getRollNo() != null ? newReg.getRollNo().trim() : 
                            (newReg.getRoll_no() != null ? newReg.getRoll_no().trim() : "");
            String branch = newReg.getBranch() != null ? newReg.getBranch().trim() : "CSE";
            String year = newReg.getYear() != null ? newReg.getYear().trim() : "2";
            String email = newReg.getEmail() != null ? newReg.getEmail().trim() : "";
            String eventId = newReg.getEventId() != null ? newReg.getEventId().trim() : 
                             (newReg.getEvent_id() != null ? newReg.getEvent_id().trim() : "");

            // Simple validation
            if (studentName.isEmpty() || rollNo.isEmpty() || email.isEmpty() || eventId.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"status\": \"error\", \"message\": \"All fields (name, rollNo, email, eventId) are required.\"}");
                return;
            }

            // Connecting to mysql database
            Connection conn = DBConnection.getConnection();

            if (conn == null) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"status\": \"error\", \"message\": \"Database connection failed\"}");
                return;
            }

            // Check if student has already registered for this event
            String checkSql = "SELECT id FROM registrations WHERE roll_no = ? AND event_id = ?";
            PreparedStatement checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setString(1, rollNo);
            checkStmt.setString(2, eventId);
            ResultSet checkRs = checkStmt.executeQuery();

            if (checkRs.next()) {
                checkRs.close();
                checkStmt.close();
                conn.close();
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                out.print("{\"status\": \"error\", \"message\": \"Student with roll number " + rollNo + " is already registered for this event.\"}");
                return;
            }
            checkRs.close();
            checkStmt.close();

            // Raw SQL insert query using PreparedStatement
            String insertSql = "INSERT INTO registrations (student_name, roll_no, branch, year, email, event_id) " +
                               "VALUES (?, ?, ?, ?, ?, ?)";

            PreparedStatement ps = conn.prepareStatement(insertSql);
            ps.setString(1, studentName);
            ps.setString(2, rollNo);
            ps.setString(3, branch);
            ps.setString(4, year);
            ps.setString(5, email);
            ps.setString(6, eventId);

            // Executing insert query
            int rowsInserted = ps.executeUpdate();

            // Sending json response to react
            if (rowsInserted > 0) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                out.print("{\"status\": \"success\", \"message\": \"Student registered successfully!\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"status\": \"error\", \"message\": \"Failed to register student\"}");
            }

            // Close resources
            ps.close();
            conn.close();

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"status\": \"error\", \"message\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"status\": \"error\", \"message\": \"Internal server error\"}");
        }
    }
}
