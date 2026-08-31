export default function AgentBoard({ agents }) {
  return (
    <section className="panel agent-board" aria-labelledby="agents-title">
      <div className="section-heading">
        <p className="eyebrow">Swarm roles</p>
        <h2 id="agents-title">Agent board</h2>
      </div>
      <div className="agent-grid">
        {agents.map((agent) => (
          <article className="agent-card" key={agent.id}>
            <div className="agent-card-header">
              <div>
                <h3>{agent.name}</h3>
                <p>{agent.role}</p>
              </div>
              <span className={`badge state-${agent.state}`}>{agent.state}</span>
            </div>
            <dl>
              <dt>Specialty</dt>
              <dd>{agent.specialty}</dd>
              <dt>Active task</dt>
              <dd>{agent.activeTask}</dd>
              <dt>Last message</dt>
              <dd>{agent.lastMessage}</dd>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
