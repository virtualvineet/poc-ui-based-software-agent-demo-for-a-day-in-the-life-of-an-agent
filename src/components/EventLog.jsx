function Direction({ event }) {
  if (!event.from || !event.to) {
    return <span className="direction">System event</span>;
  }

  return (
    <span className="direction">
      {event.from} <span aria-hidden="true">→</span> {event.to}
    </span>
  );
}

export default function EventLog({ events, messages }) {
  return (
    <section className="panel event-log" aria-labelledby="event-log-title">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">Audit trail</p>
          <h2 id="event-log-title">Collaboration events</h2>
        </div>
        <span className="message-count">{messages.length} messages</span>
      </div>
      <ol className="events">
        {events.map((event) => (
          <li className={`event event-${event.kind}`} key={event.id}>
            <div className="event-meta">
              <time>{event.timestamp}</time>
              <span>{event.messageType ?? event.kind}</span>
              <Direction event={event} />
            </div>
            <h3>{event.title}</h3>
            <p>{event.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
