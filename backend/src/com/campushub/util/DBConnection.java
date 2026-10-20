package com.campushub.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

// Helper class to connect to MySQL database using standard JDBC
public class DBConnection {

    // Database connection credentials (hardcoded for college mini-project)
    private static final String URL = "jdbc:mysql://localhost:3306/campus_event_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "root123"; // Updated for your new reset password

    // Method to get a fresh database connection
    public static Connection getConnection() {
        Connection conn = null;
        try {
            // Loading MySQL JDBC Driver class
            Class.forName("com.mysql.cj.jdbc.Driver");
            // Connecting to mysql database
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException e) {
            System.out.println("Error: MySQL JDBC Driver not found! Make sure mysql-connector-j jar is in WEB-INF/lib");
            e.printStackTrace();
        } catch (SQLException e) {
            System.out.println("Error: Could not connect to MySQL database!");
            e.printStackTrace();
        }
        return conn;
    }
}
