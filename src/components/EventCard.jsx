// EventCard.jsx — one floating card in the "Upcoming Events" grid.
// It receives the event object, how many students registered, and the
// Register button callback from App.jsx.

function EventCard({ event, registered, onRegister }) {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  // tiny helper to pull day / month out of a "2026-03-14" date string
  const parts = String(event.date || "").split("-");
  const day = parts.length === 3 ? parts[2] : "TBD";
  const mon = parts.length === 3 ? months[parseInt(parts[1]) - 1] || "" : "—";

  // seats fill percentage for the progress bar
  const total = event.seats || 0;
  const pct = total > 0 ? Math.min(100, Math.round((registered / total) * 100)) : 0;

  // a small colour per tag (unknown tags fall back to cyan)
  const tagColors = {
    Hackathon: "tag-cyan",
    Cybersecurity: "tag-pink",
    Workshop: "tag-violet",
    "Tech Fest": "tag-amber",
    Bootcamp: "tag-mint",
    "Club Meetup": "tag-cyan",
  };

  return (
    <div className="event-card">
      <div className="card-top">
        <span className={"tag " + (tagColors[event.tag] || "tag-cyan")}>{event.tag}</span>
        <div className="cal-chip">
          <div className="day">{day}</div>
          <div className="mon">{mon}</div>
        </div>
      </div>

      <h3>{event.title}</h3>
      <p className="desc">{event.description}</p>

      <div className="meta">
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          {event.time || "09:00"} hrs
        </span>
        <span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {event.venue}
        </span>
      </div>

      <div className="seats">
        <div className="seats-label">
          <span>Seats filled</span>
          <span>
            {registered} / {total}
          </span>
        </div>
        <div className="seats-bar">
          <div className={"seats-fill" + (pct >= 85 ? " warn" : "")} style={{ width: pct + "%" }}></div>
        </div>
      </div>

      <button className="btn btn-neon" onClick={onRegister}>
        Register
      </button>
    </div>
  );
}

export default EventCard;
