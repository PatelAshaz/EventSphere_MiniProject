// App.jsx - EventSphere Tech Club & Event Management Hub
// Frontend for our miniproject: React (this file) + Java Servlet backend.
//
// How it works:
//  1. On page load, a useEffect() fires two fetch() calls to the Tomcat
//     server at http://localhost:8080/CampusHub/api/...
//  2. If the server is NOT running yet, the catch block kicks in and we
//     keep the dummy data defined below, so the UI still works in demo mode.
//  3. A simple activeTab state variable switches between the 3 views
//     (no react-router — keep it student-level).
import { useState, useEffect } from "react";
import EventCard from "./components/EventCard.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import "./App.css";

// ================= backend base URL =================
// Change the host/port here if your Tomcat runs somewhere else.
const API_BASE = "http://localhost:8080/CampusHub/api";

// ================= dummy data (fallback) =================
// Used ONLY when the servlet server is offline. The useEffect below always
// tries a real fetch() first — if it throws, we setEvents(DUMMY_EVENTS)
// instead, which is how the app "switches" from dummy data to live data.
const DUMMY_EVENTS = [
  {
    id: "EVT-101",
    title: "Nebula Hack 2026",
    tag: "Hackathon",
    date: "2026-03-14",
    time: "09:00",
    venue: "CSE Seminar Hall",
    seats: 120,
    description:
      "24-hour build sprint on the theme “Life on Station”. Teams of 4, mentor sessions every 6 hours, coffee on us and a 50k prize pool.",
  },
  {
    id: "EVT-102",
    title: "Zero-G CTF",
    tag: "Cybersecurity",
    date: "2026-03-21",
    time: "10:00",
    venue: "IT Lab 2",
    seats: 60,
    description:
      "Capture the Flag across web, crypto and forensics tracks. Beginner-friendly challenges included — solo or pairs.",
  },
  {
    id: "EVT-103",
    title: "AI/ML Foundations Workshop",
    tag: "Workshop",
    date: "2026-03-07",
    time: "14:00",
    venue: "Auditorium B",
    seats: 150,
    description:
      "Hands-on intro to neural networks in Python. Bring a laptop — we cover setup, your first model and Kaggle tips.",
  },
  {
    id: "EVT-104",
    title: "OrbitFest Tech Expo",
    tag: "Tech Fest",
    date: "2026-04-02",
    time: "09:30",
    venue: "Main Grounds",
    seats: 500,
    description:
      "The club flagship: robot sumo, drone race, project showcase stalls, guest talks and a demo night till midnight.",
  },
  {
    id: "EVT-105",
    title: "Full-Stack Bootcamp (Batch 3)",
    tag: "Bootcamp",
    date: "2026-03-28",
    time: "16:00",
    venue: "Innovation Lab",
    seats: 40,
    description:
      "8-week evening track: React, Node.js and deployment. Certificate plus an internship referral on completion.",
  },
  {
    id: "EVT-106",
    title: "Rocketry & Drones Open Day",
    tag: "Club Meetup",
    date: "2026-04-09",
    time: "11:00",
    venue: "Sports Field Annex",
    seats: 200,
    description:
      "Watch solid-fuel model rockets lift off, fly FPV drones and talk to the team about joining the build bench.",
  },
];

const DUMMY_REGISTRATIONS = [
  { rollNo: "CS23B012", name: "Aarav Sharma", branch: "CSE", year: "2", email: "aarav.sharma@campus.edu", eventId: "EVT-101", eventName: "Nebula Hack 2026" },
  { rollNo: "CS23B045", name: "Diya Patel", branch: "CSE", year: "2", email: "diya.patel@campus.edu", eventId: "EVT-103", eventName: "AI/ML Foundations Workshop" },
  { rollNo: "IT23B009", name: "Rohan Verma", branch: "IT", year: "2", email: "rohan.verma@campus.edu", eventId: "EVT-101", eventName: "Nebula Hack 2026" },
  { rollNo: "EE23B023", name: "Sneha Iyer", branch: "EE", year: "2", email: "sneha.iyer@campus.edu", eventId: "EVT-102", eventName: "Zero-G CTF" },
  { rollNo: "CS22B071", name: "Kabir Singh", branch: "CSE", year: "3", email: "kabir.singh@campus.edu", eventId: "EVT-105", eventName: "Full-Stack Bootcamp (Batch 3)" },
  { rollNo: "ME23B016", name: "Ananya Reddy", branch: "ME", year: "2", email: "ananya.reddy@campus.edu", eventId: "EVT-106", eventName: "Rocketry & Drones Open Day" },
  { rollNo: "CS23B088", name: "Ishaan Mehta", branch: "CSE", year: "2", email: "ishaan.mehta@campus.edu", eventId: "EVT-101", eventName: "Nebula Hack 2026" },
  { rollNo: "IT24B004", name: "Tara Nair", branch: "IT", year: "1", email: "tara.nair@campus.edu", eventId: "EVT-103", eventName: "AI/ML Foundations Workshop" },
];

function App() {
  // simple state-driven navigation (no router library)
  const [activeTab, setActiveTab] = useState("events");
  const [role, setRole] = useState("");
  const [loginRole, setLoginRole] = useState("student");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(""); // event preselected in the register form
  const [serverOnline, setServerOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---------- GET all events from the servlet ----------
  const loadEvents = async () => {
    try {
      const res = await fetch(API_BASE + "/events");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setEvents(data); // live data from the backend
      setServerOnline(true);
      console.log("[EventSphere] Events loaded from backend:", data);
    } catch (err) {
      // Tomcat not running -> keep the dummy data so the demo still works
      console.log("[EventSphere] Backend offline, using dummy events:", err.message);
      setEvents(DUMMY_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  // ---------- GET all registrations (for the admin table) ----------
  const loadRegistrations = async () => {
    try {
      const res = await fetch(API_BASE + "/registrations");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      setRegistrations(data);
      console.log("[EventSphere] Registrations loaded from backend:", data);
    } catch (err) {
      console.log("[EventSphere] Backend offline, using dummy registrations:", err.message);
      setRegistrations(DUMMY_REGISTRATIONS);
    }
  };

  // fire both fetches once when the app mounts
  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, []);

  // ---------- POST a student registration ----------
  const handleRegister = async (student) => {
    try {
      const res = await fetch(API_BASE + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      console.log("[EventSphere] Registration saved to backend:", student);
    } catch (err) {
      console.log("[EventSphere] Backend offline -> keeping registration in memory:", err.message);
    }
    // either way, show it in the admin table of this session
    setRegistrations((prev) => [student, ...prev]);
  };

  // ---------- POST a new event (admin) ----------
  const handleAddEvent = async (event) => {
    try {
      const res = await fetch(API_BASE + "/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      console.log("[EventSphere] New event saved to backend:", event);
    } catch (err) {
      console.log("[EventSphere] Backend offline -> adding event locally:", err.message);
    }
    setEvents((prev) => [event, ...prev]);
  };

  // Register button on an event card -> jump to the form with that event preset
  const goToRegister = (eventId) => {
    setSelectedEventId(eventId);
    setActiveTab("register");
  };

  // Demo-only login: the servlet project does not provide an auth endpoint yet.
  // Real access control must be checked by the Java backend, not by React.
  const handleLogin = (e) => {
    e.preventDefault();
    const valid = loginRole === "admin"
      ? loginForm.username.trim() === "admin" && loginForm.password === "admin123"
      : loginForm.username.trim() === "student" && loginForm.password === "student123";

    if (!valid) {
      setLoginError("Incorrect username or password. Try the demo credentials below.");
      return;
    }

    setRole(loginRole);
    setActiveTab(loginRole === "admin" ? "admin" : "events");
    setLoginForm({ username: "", password: "" });
    setLoginError("");
  };

  const handleLogout = () => {
    setRole("");
    setLoginRole("student");
    setLoginForm({ username: "", password: "" });
    setLoginError("");
    setSelectedEventId("");
    setActiveTab("events");
  };

  const studentTabs = [
    { id: "events", label: "Upcoming Events" },
    { id: "register", label: "Student Registration" },
  ];

  return (
    <div className="app">
      {/* ---------- decorative antigravity background ---------- */}
      <div className="bg-layer" aria-hidden="true">
        <div className="grid-overlay"></div>
        <div className="starfield stars-a"></div>
        <div className="starfield stars-b"></div>
        <span className="orb orb-1"></span>
        <span className="orb orb-2"></span>
        <span className="orb orb-3"></span>
        <span className="orb orb-4"></span>
        <span className="orb orb-5"></span>
      </div>

      <div className="shell">
        {/* ---------- top bar ---------- */}
        <header className="topbar">
          <div className="logo-orb" aria-hidden="true"></div>
          <div className="brand">
            <h1>
              Event<span>Sphere</span>
            </h1>
            <small>Event Management Hub</small>
          </div>
          <div className={"status-pill " + (serverOnline ? "status-online" : "status-offline")}>
            <span className="dot"></span>
            {serverOnline ? "API LINK · ONLINE" : "DEMO MODE · LOCAL DATA"}
          </div>
          {role && (
            <div className="account-actions">
              <span className="account-role">{role === "admin" ? "ADMIN ACCESS" : "STUDENT ACCESS"}</span>
              <button type="button" className="logout-btn" onClick={handleLogout}>Log out</button>
            </div>
          )}
        </header>

        {!role ? (
          <main className="login-layout">
            <div className="login-intro">
              <span className="login-eyebrow">EVENTSPHERE / ACCESS PORTAL</span>
              <h2>Event<span>Sphere.</span></h2>
              <p>One hub for the people making things happen on campus. Sign in to find your next event or run the show.</p>
              <div className="login-orbit" aria-hidden="true"><span></span></div>
            </div>

            <form className="panel login-panel" onSubmit={handleLogin}>
              <span className="login-step">01 / SELECT YOUR PORTAL</span>
              <div className="role-switch" aria-label="Select login type">
                <button
                  type="button"
                  className={"role-option" + (loginRole === "student" ? " selected" : "")}
                  onClick={() => { setLoginRole("student"); setLoginForm({ username: "", password: "" }); setLoginError(""); }}
                >
                  <span className="role-icon">01</span>
                  <strong>Student</strong>
                  <small>Explore & register</small>
                </button>
                <button
                  type="button"
                  className={"role-option" + (loginRole === "admin" ? " selected admin-selected" : "")}
                  onClick={() => { setLoginRole("admin"); setLoginForm({ username: "", password: "" }); setLoginError(""); }}
                >
                  <span className="role-icon">02</span>
                  <strong>Admin</strong>
                  <small>Manage the club</small>
                </button>
              </div>

              <div className="login-heading">
                <span className="login-step">02 / ENTER YOUR DETAILS</span>
                <h3>{loginRole === "admin" ? "Admin Login" : "Student Login"}</h3>
                <p>{loginRole === "admin" ? "For club leads and event organizers." : "Your next big idea starts here."}</p>
              </div>

              <div className="field login-field">
                <label htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  placeholder={loginRole === "admin" ? "Enter admin username" : "Enter student username"}
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="field login-field">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              {loginError && <p className="login-error" role="alert">{loginError}</p>}
              <button type="submit" className={"btn btn-wide " + (loginRole === "admin" ? "btn-violet" : "btn-neon")}>
                Enter {loginRole === "admin" ? "Admin Panel" : "Student Hub"} <span aria-hidden="true">→</span>
              </button>
              <p className="demo-hint">
                Demo login: <code>{loginRole === "admin" ? "admin" : "student"}</code> / <code>{loginRole === "admin" ? "admin123" : "student123"}</code>
              </p>
            </form>
          </main>
        ) : (
          <>
            {role === "student" && (
              <nav className="tabs" aria-label="Student navigation">
                {studentTabs.map((t) => (
                  <button
                    key={t.id}
                    className={"tab" + (activeTab === t.id ? " active" : "")}
                    onClick={() => setActiveTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>
            )}

        {/* ================= VIEW 1: UPcoming EVENTS ================= */}
        {role === "student" && activeTab === "events" && (
          <section>
            <div className="view-head">
              <h2>Upcoming Events</h2>
              <span className="count-badge">{events.length} LIVE</span>
            </div>

            <div className="events-grid">
              {loading ? (
                <div className="loading-card">
                  <div className="spinner"></div>
                  CONNECTING TO SERVER...
                </div>
              ) : (
                events.map((e, i) => (
                  <div
                    className="float-wrap"
                    key={e.id}
                    style={{ animationDelay: i * 110 + "ms, " + (1 + i * 0.9) + "s" }}
                  >
                    <EventCard
                      event={e}
                      registered={registrations.filter((r) => r.eventId === e.id).length}
                      onRegister={() => goToRegister(e.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ================= VIEW 2: STUDENT REGISTRATION ================= */}
        {role === "student" && activeTab === "register" && (
          <section>
            <div className="view-head">
              <h2>Student Registration</h2>
              <span className="count-badge">FREE ENTRY</span>
              <p>Fill the form — details go straight to the Java servlet</p>
            </div>
            <RegisterForm
              events={events}
              registrations={registrations}
              defaultEventId={selectedEventId}
              onRegister={handleRegister}
            />
          </section>
        )}

        {/* ================= VIEW 3: ADMIN PANEL ================= */}
        {role === "admin" && activeTab === "admin" && (
          <section>
            <div className="view-head">
              <h2>Admin Panel</h2>
              <span className="count-badge">STAFF ONLY</span>
              <p>Club leads: publish events and review sign-ups</p>
            </div>
            <AdminPanel
              events={events}
              registrations={registrations}
              onAddEvent={handleAddEvent}
            />
          </section>
        )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
