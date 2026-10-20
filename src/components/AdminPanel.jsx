// AdminPanel.jsx — for the club leads.
// Left: a small form to publish a new event (POSTed to the servlet).
// Right: stats + an HTML <table> of all registered students with an
// "all events / one event" filter dropdown.
import { useState } from "react";

function AdminPanel({ events, registrations, onAddEvent }) {
  const emptyEvent = {
    title: "",
    description: "",
    date: "",
    time: "09:00",
    venue: "",
    tag: "Workshop",
    seats: "50",
  };

  const [form, setForm] = useState(emptyEvent);
  const [filter, setFilter] = useState("all");

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.venue.trim())
      return alert("Please fill the title, date and venue");

    const event = {
      id: "EVT-" + Date.now(), // unique id, servlet would generate this in real life
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      time: form.time || "09:00",
      venue: form.venue.trim(),
      tag: form.tag,
      seats: parseInt(form.seats) || 50,
    };

    await onAddEvent(event); // POSTs to the servlet in App.jsx
    console.log("[EventSphere] New event published:", event);
    alert("Event added successfully!");
    setForm(emptyEvent);
  };

  // table rows after applying the filter
  const filtered =
    filter === "all" ? registrations : registrations.filter((r) => r.eventId === filter);

  // tiny "most popular event" calc using a plain object (no lodash needed)
  let popular = "—";
  if (registrations.length > 0) {
    const counts = {};
    registrations.forEach((r) => {
      const name = r.eventName || r.eventId;
      counts[name] = (counts[name] || 0) + 1;
    });
    popular = Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b));
  }

  const eventNameOf = (r) => {
    // prefer the name stored with the registration, otherwise look it up
    if (r.eventName) return r.eventName;
    const ev = events.find((e) => e.id === r.eventId);
    return ev ? ev.title : r.eventId;
  };

  return (
    <div className="admin-layout">
      {/* ------- left: add event form ------- */}
      <form className="panel" onSubmit={handleAddEvent}>
        <h3 className="panel-title">Publish New Event</h3>

        <div className="form-grid single">
          <div className="field full">
            <label htmlFor="title">Event Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Nebula Hack 2026"
              value={form.title}
              onChange={update("title")}
            />
          </div>

          <div className="field">
            <label htmlFor="tag">Category</label>
            <select id="tag" value={form.tag} onChange={update("tag")}>
              <option>Workshop</option>
              <option>Hackathon</option>
              <option>Tech Fest</option>
              <option>Bootcamp</option>
              <option>Cybersecurity</option>
              <option>Club Meetup</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="seats">Seats</label>
            <input
              id="seats"
              type="number"
              min="1"
              value={form.seats}
              onChange={update("seats")}
            />
          </div>

          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" value={form.date} onChange={update("date")} />
          </div>

          <div className="field">
            <label htmlFor="time">Time</label>
            <input id="time" type="time" value={form.time} onChange={update("time")} />
          </div>

          <div className="field full">
            <label htmlFor="venue">Venue</label>
            <input
              id="venue"
              type="text"
              placeholder="e.g. CSE Seminar Hall"
              value={form.venue}
              onChange={update("venue")}
            />
          </div>

          <div className="field full">
            <label htmlFor="desc">Description</label>
            <textarea
              id="desc"
              rows="3"
              placeholder="What is the event about?"
              value={form.description}
              onChange={update("description")}
            ></textarea>
          </div>
        </div>

        <button className="btn btn-violet btn-wide" type="submit">
          Add Event
        </button>
      </form>

      {/* ------- right: stats + registrations table ------- */}
      <div className="admin-right">
        <div className="stats">
          <div className="stat">
            <b>{events.length}</b>
            <span>Total Events</span>
          </div>
          <div className="stat">
            <b>{registrations.length}</b>
            <span>Total Registrations</span>
          </div>
          <div className="stat">
            <b className="stat-name" title={popular}>
              {popular}
            </b>
            <span>Most Popular</span>
          </div>
        </div>

        <div className="panel table-panel">
          <div className="table-head-row">
            <h3 className="panel-title">Registered Students</h3>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Branch</th>
                  <th>Year</th>
                  <th>Email</th>
                  <th>Event</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td className="empty-cell" colSpan="6">
                      No registrations yet — they will appear here once students sign up.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr key={r.rollNo + r.eventId + i}>
                      <td className="roll">{r.rollNo}</td>
                      <td>{r.name}</td>
                      <td>{r.branch}</td>
                      <td>{r.year}</td>
                      <td className="dim">{r.email}</td>
                      <td className="event-cell">{eventNameOf(r)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
