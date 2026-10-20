package com.campushub.model;

// Model class representing a Campus Event
// Follows standard JavaBean conventions with getters and setters
public class Event {
    private String id;
    private String title;
    private String club_name;   // name of organizing club
    private String tag;         // alias used by frontend UI
    private String event_date;  // date of the event (YYYY-MM-DD)
    private String date;        // alias used by frontend UI
    private String time;        // time of the event (e.g. 09:00)
    private String venue;       // location / hall
    private int seats;          // maximum seating capacity
    private String description; // event description

    // Default constructor (required by Gson)
    public Event() {
    }

    // Parameterized constructor
    public Event(String id, String title, String club_name, String event_date, String time, String venue, int seats, String description) {
        this.id = id;
        this.title = title;
        this.club_name = club_name;
        this.tag = club_name;
        this.event_date = event_date;
        this.date = event_date;
        this.time = time;
        this.venue = venue;
        this.seats = seats;
        this.description = description;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getClub_name() {
        return club_name != null ? club_name : tag;
    }

    public void setClub_name(String club_name) {
        this.club_name = club_name;
        this.tag = club_name; // keeps frontend compatibility
    }

    public String getTag() {
        return tag != null ? tag : club_name;
    }

    public void setTag(String tag) {
        this.tag = tag;
        this.club_name = tag;
    }

    public String getEvent_date() {
        return event_date != null ? event_date : date;
    }

    public void setEvent_date(String event_date) {
        this.event_date = event_date;
        this.date = event_date; // keeps frontend compatibility
    }

    public String getDate() {
        return date != null ? date : event_date;
    }

    public void setDate(String date) {
        this.date = date;
        this.event_date = date;
    }

    public String getTime() {
        return time != null ? time : "09:00";
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public int getSeats() {
        return seats > 0 ? seats : 100;
    }

    public void setSeats(int seats) {
        this.seats = seats;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
