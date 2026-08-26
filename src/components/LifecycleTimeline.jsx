export default function LifecycleTimeline({ timeline }) {
  return (
    <section className="panel timeline-panel" aria-labelledby="timeline-title">
      <div className="section-heading">
        <p className="eyebrow">Lifecycle</p>
        <h2 id="timeline-title">Stage timeline</h2>
      </div>
      <ol className="timeline">
        {timeline.map((stage) => (
          <li className={`timeline-item ${stage.status}`} key={stage.id} aria-current={stage.status === 'current' ? 'step' : undefined}>
            <span className="timeline-dot" aria-hidden="true" />
            <div>
              <strong>{stage.label}</strong>
              <span>{stage.status}</span>
              <p>{stage.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
