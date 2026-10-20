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

import com.campushub.model.Event;
import com.campushub.util.DBConnection;
import com.google.gson.Gson;

// Servlet mapping for /api/events
@WebServlet(urlPatterns = {"/api/events", "/api/events/*"})
public class EventServlet extends HttpServlet {

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

    // GET /api/events -> Fetch all events from MySQL database
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Adding CORS headers so React frontend can read response
        addCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        List<Event> eventList = new ArrayList<>();

        // Raw SQL query to get all events ordered by date
        String sql = "SELECT * FROM events ORDER BY event_date ASC";

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
            rs = stmt.executeQuery();

            // Loop through each row in ResultSet and map to Event model
            while (rs.next()) {
                Event ev = new Event();
                ev.setId(rs.getString("id"));
                ev.setTitle(rs.getString("title"));

                String club = rs.getString("club_name");
                ev.setClub_name(club);
                ev.setTag(club); // alias for React frontend

                String evDate = rs.getString("event_date");
                ev.setEvent_date(evDate);
                ev.setDate(evDate); // alias for React frontend

                ev.setTime(rs.getString("time"));
                ev.setVenue(rs.getString("venue"));
                ev.setSeats(rs.getInt("seats"));
                ev.setDescription(rs.getString("description"));

                eventList.add(ev);
            }

            // Converting Java ArrayList into JSON string using Gson
            String jsonResponse = gson.toJson(eventList);

            // Sending json response to react
            out.print(jsonResponse);
            out.flush();

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Failed to retrieve events: " + e.getMessage() + "\"}");
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

    // POST /api/events -> Add a new event to MySQL database
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

            // Parse JSON into Event Java object using Gson
            Event newEvent = gson.fromJson(sb.toString(), Event.class);

            if (newEvent == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"status\": \"error\", \"message\": \"Invalid JSON request body\"}");
                return;
            }

            // Generate event ID if not provided (e.g. EVT-171...)
            if (newEvent.getId() == null || newEvent.getId().trim().isEmpty()) {
                newEvent.setId("EVT-" + System.currentTimeMillis());
            }

            // Fallback for fields
            String clubName = newEvent.getClub_name() != null ? newEvent.getClub_name() : newEvent.getTag();
            String eventDate = newEvent.getEvent_date() != null ? newEvent.getEvent_date() : newEvent.getDate();
            String time = newEvent.getTime() != null ? newEvent.getTime() : "09:00";
            int seats = newEvent.getSeats() > 0 ? newEvent.getSeats() : 100;

            // Connecting to mysql database
            Connection conn = DBConnection.getConnection();

            if (conn == null) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"status\": \"error\", \"message\": \"Database connection failed\"}");
                return;
            }

            // Raw SQL insert query using PreparedStatement
            String sql = "INSERT INTO events (id, title, club_name, event_date, time, venue, seats, description) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setString(1, newEvent.getId());
            ps.setString(2, newEvent.getTitle());
            ps.setString(3, clubName != null ? clubName : "General");
            ps.setString(4, eventDate != null ? eventDate : "2026-04-01");
            ps.setString(5, time);
            ps.setString(6, newEvent.getVenue() != null ? newEvent.getVenue() : "Main Campus");
            ps.setInt(7, seats);
            ps.setString(8, newEvent.getDescription() != null ? newEvent.getDescription() : "");

            // Executing insert query
            int rowsInserted = ps.executeUpdate();

            // Sending json response to react
            if (rowsInserted > 0) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                out.print("{\"status\": \"success\", \"message\": \"Event added successfully\", \"id\": \"" + newEvent.getId() + "\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"status\": \"error\", \"message\": \"Failed to add event\"}");
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
