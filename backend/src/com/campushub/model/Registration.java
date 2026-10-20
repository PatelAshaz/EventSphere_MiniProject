package com.campushub.model;

// Model class representing a Student Registration for an Event
// Follows standard JavaBean conventions with getters and setters
public class Registration {
    private int id;
    private String student_name; // student's full name
    private String name;         // alias used by React frontend
    private String roll_no;      // roll number (e.g. CS23B012)
    private String rollNo;       // alias used by React frontend
    private String branch;       // branch (CSE, IT, EE, etc.)
    private String year;         // year of study (1, 2, 3, 4)
    private String email;        // student email
    private String event_id;     // ID of the event registered for
    private String eventId;      // alias used by React frontend
    private String eventName;    // title of the event for display

    // Default constructor (required by Gson)
    public Registration() {
    }

    // Parameterized constructor
    public Registration(int id, String student_name, String roll_no, String branch, String year, String email, String event_id) {
        this.id = id;
        this.student_name = student_name;
        this.name = student_name;
        this.roll_no = roll_no;
        this.rollNo = roll_no;
        this.branch = branch;
        this.year = year;
        this.email = email;
        this.event_id = event_id;
        this.eventId = event_id;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStudent_name() {
        return student_name != null ? student_name : name;
    }

    public void setStudent_name(String student_name) {
        this.student_name = student_name;
        this.name = student_name; // keeps frontend compatibility
    }

    public String getName() {
        return name != null ? name : student_name;
    }

    public void setName(String name) {
        this.name = name;
        this.student_name = name;
    }

    public String getRoll_no() {
        return roll_no != null ? roll_no : rollNo;
    }

    public void setRoll_no(String roll_no) {
        this.roll_no = roll_no;
        this.rollNo = roll_no; // keeps frontend compatibility
    }

    public String getRollNo() {
        return rollNo != null ? rollNo : roll_no;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
        this.roll_no = rollNo;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEvent_id() {
        return event_id != null ? event_id : eventId;
    }

    public void setEvent_id(String event_id) {
        this.event_id = event_id;
        this.eventId = event_id; // keeps frontend compatibility
    }

    public String getEventId() {
        return eventId != null ? eventId : event_id;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
        this.event_id = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }
}
