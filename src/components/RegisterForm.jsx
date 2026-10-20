// RegisterForm.jsx — controlled form for students to register for an event.
// On submit it calls onRegister() from App.jsx, which POSTs to the Java
// servlet (and falls back to in-memory data when the server is offline).
import { useState } from "react";

function RegisterForm({ events, registrations, defaultEventId, onRegister }) {
  const empty = { eventId: "", rollNo: "", name: "", branch: "CSE", year: "2", email: "" };

  // preselect the event the student clicked "Register" on (if any)
  const [form, setForm] = useState(
    { ...empty, eventId: defaultEventId || (events.length ? events[0].id : "") }
  );

  // one helper to update any field (keeps the code short)
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // very basic validation, like a real student project :)
    if (!form.eventId) return alert("Please select an event first");
    if (!form.rollNo.trim() || !form.name.trim()) return alert("Please fill your roll no and name");
    if (!form.email.includes("@")) return alert("Please enter a valid email address");

    // block the same roll no from double-registering for one event
    const already = registrations.some(
      (r) => r.rollNo === form.rollNo.trim() && r.eventId === form.eventId
    );
    if (already) return alert("This roll no is already registered for the selected event");

    const chosen = events.find((ev) => ev.id === form.eventId);
    const student = {
      rollNo: form.rollNo.trim(),
      name: form.name.trim(),
      branch: form.branch,
      year: form.year,
      email: form.email.trim(),
      eventId: form.eventId,
      eventName: chosen ? chosen.title : form.eventId,
    };

    await onRegister(student); // POSTs to the servlet in App.jsx
    console.log("[EventSphere] Student registered:", student);
    alert("Registration Successful!");

    setForm({ ...empty, eventId: form.eventId }); // keep event, clear the rest
  };

  // details of the currently selected event for the side summary panel
  const chosen = events.find((ev) => ev.id === form.eventId) || null;
  const seatsLeft = chosen
    ? Math.max(0, (chosen.seats || 0) - registrations.filter((r) => r.eventId === chosen.id).length)
    : 0;

  return (
    <div className="register-layout">
      {/* ------- left: the actual form ------- */}
      <form className="panel" onSubmit={handleSubmit}>
        <h3 className="panel-title">Enroll Form</h3>

        <div className="form-grid">
          <div className="field full">
            <label htmlFor="event">Event</label>
            <select id="event" value={form.eventId} onChange={update("eventId")}>
              {events.length === 0 && <option value="">No events yet</option>}
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} — {ev.date}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="rollNo">Roll No</label>
            <input
              id="rollNo"
              type="text"
              placeholder="e.g. CS23B012"
              value={form.rollNo}
              onChange={update("rollNo")}
            />
          </div>

          <div className="field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={form.name}
              onChange={update("name")}
            />
          </div>

          <div className="field">
            <label htmlFor="branch">Branch</label>
            <select id="branch" value={form.branch} onChange={update("branch")}>
              <option>CSE</option>
              <option>IT</option>
              <option>ECE</option>
              <option>EE</option>
              <option>ME</option>
              <option>CE</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="year">Year</label>
            <select id="year" value={form.year} onChange={update("year")}>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div className="field full">
            <label htmlFor="email">College Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@campus.edu"
              value={form.email}
              onChange={update("email")}
            />
          </div>
        </div>

        <button className="btn btn-neon btn-wide" type="submit">
          Confirm Registration
        </button>
      </form>

      {/* ------- right: live summary of the chosen event ------- */}
      <div className="panel side-panel">
        <h3 className="panel-title">Session Summary</h3>

        {chosen ? (
          <ul className="summary-list">
            <li>
              <span>Event</span>
              <b>{chosen.title}</b>
            </li>
            <li>
              <span>Date</span>
              <b>{chosen.date}</b>
            </li>
            <li>
              <span>Time</span>
              <b>{chosen.time || "09:00"} hrs</b>
            </li>
            <li>
              <span>Venue</span>
              <b>{chosen.venue}</b>
            </li>
            <li>
              <span>Seats left</span>
              <b className={seatsLeft <= 5 ? "warn-text" : "ok-text"}>{seatsLeft}</b>
            </li>
          </ul>
        ) : (
          <p className="muted">Pick an event to see its details here.</p>
        )}

      </div>
    </div>
  );
}

export default RegisterForm;
