const lifecycleStages = [
  {
    id: 'discover',
    label: 'Discover',
    summary: 'Frame the user goal, available context, and scoped MCP-like tools before work begins.'
  },
  {
    id: 'plan',
    label: 'Plan',
    summary: 'Choose an orchestrator-worker or peer-to-peer coordination pattern for the job.'
  },
  {
    id: 'research',
    label: 'Research',
    summary: 'Gather evidence from simulated tool and data surfaces while preserving context discipline.'
  },
  {
    id: 'implement',
    label: 'Implement',
    summary: 'Turn the plan into a software change with observable collaboration between agents.'
  },
  {
    id: 'review',
    label: 'Review',
    summary: 'Inspect the work for failure handling, security scoping, and production readiness.'
  },
  {
    id: 'observe',
    label: 'Observe',
    summary: 'Emit telemetry, note risks, and make the final lifecycle state easy to audit.'
  },
  {
    id: 'complete',
    label: 'Complete',
    summary: 'Close the loop with a completed demo story and no external network or model calls.'
  }
];

const agentBlueprints = [
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    role: 'Lifecycle coordinator',
    specialty: 'Breaks the goal into scoped work and decides when to delegate.'
  },
  {
    id: 'researcher',
    name: 'Researcher',
    role: 'Context scout',
    specialty: 'Summarizes chapter concepts and simulated MCP tool/data findings.'
  },
  {
    id: 'coder',
    name: 'Coder',
    role: 'Implementation agent',
    specialty: 'Transforms requirements into a focused software-engineering swarm plan.'
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    role: 'Safety and quality reviewer',
    specialty: 'Challenges failure handling, security scope, observability, and context boundaries.'
  }
];

const stepScripts = [
  {
    stageId: 'plan',
    headline: 'Orchestrator chooses a coordination pattern',
    updates: {
      orchestrator: ['planning', 'Compare peer-to-peer and orchestrator-worker flows for this demo.'],
      researcher: ['communicating', 'Wait for a scoped discovery request.'],
      coder: ['idle', 'Stand by for implementation constraints.'],
      reviewer: ['idle', 'Stand by for production-readiness checks.']
    },
    messages: [
      ['orchestrator', 'researcher', 'delegation', 'Map MCP as the tool/data layer and list chapter concepts we can safely simulate.'],
      ['orchestrator', 'coder', 'delegation', 'Prepare a deterministic software-agent lifecycle rather than a real LLM workflow.']
    ],
    notes: [
      'The demo starts with orchestrator-worker delegation so state changes stay easy to follow.',
      'No real MCP server, model provider, authentication system, or persistence layer is contacted.'
    ]
  },
  {
    stageId: 'research',
    headline: 'Researcher gathers scoped context through simulated tools',
    updates: {
      orchestrator: ['communicating', 'Keep the research request narrow and auditable.'],
      researcher: ['acting', 'Use simulated MCP resources to collect chapter-aligned examples.'],
      coder: ['planning', 'Convert findings into UI states and event types.'],
      reviewer: ['idle', 'Watch for claims that overstate protocol compliance.']
    },
    messages: [
      ['researcher', 'orchestrator', 'tool-result', 'MCP is represented as a label for scoped tools and data, not a live protocol integration.'],
      ['researcher', 'coder', 'peer-sync', 'Research-team examples need explicit peer messages, not just static agent cards.']
    ],
    notes: [
      'A research-team pattern appears as Researcher-to-Coder peer synchronization.',
      'Context discipline is visualized by concise, scoped messages instead of unbounded transcript replay.'
    ]
  },
  {
    stageId: 'implement',
    headline: 'Coder implements the deterministic swarm story',
    updates: {
      orchestrator: ['communicating', 'Track implementation progress without micromanaging every action.'],
      researcher: ['communicating', 'Clarify source concepts when peers ask for context.'],
      coder: ['acting', 'Build snapshots, lifecycle stages, directed messages, and event log entries.'],
      reviewer: ['reviewing', 'Prepare to inspect failure and security concerns.']
    },
    messages: [
      ['coder', 'researcher', 'peer-sync', 'Confirm that software-engineering swarm examples should show delegation plus peer collaboration.'],
      ['coder', 'reviewer', 'handoff', 'Implementation is ready for checks on observability and scoped access.']
    ],
    notes: [
      'The software-engineering swarm is modeled through Orchestrator, Researcher, Coder, and Reviewer roles.',
      'Every advancement is deterministic, making tests and local demos repeatable.'
    ]
  },
  {
    stageId: 'review',
    headline: 'Reviewer challenges production-readiness gaps',
    updates: {
      orchestrator: ['planning', 'Decide whether findings should block or proceed.'],
      researcher: ['idle', 'Keep supporting context available.'],
      coder: ['communicating', 'Respond to review findings with bounded changes.'],
      reviewer: ['reviewing', 'Check failure handling, security/scoping, observability, and context discipline.']
    },
    messages: [
      ['reviewer', 'coder', 'review', 'Show API error states and do not hide backend failures from the user.'],
      ['reviewer', 'orchestrator', 'risk', 'Mark external protocols as simulated so the demo does not imply compliance.']
    ],
    notes: [
      'Review focuses on product concerns: failures, scoping, observability, and honest protocol boundaries.',
      'A possible blocked state is represented by review feedback rather than by a broken runtime.'
    ]
  },
  {
    stageId: 'observe',
    headline: 'Team emits an observable completion trail',
    updates: {
      orchestrator: ['communicating', 'Summarize what happened and expose the current snapshot.'],
      researcher: ['complete', 'Research notes are captured in the event stream.'],
      coder: ['complete', 'Implementation handoff is represented in UI state.'],
      reviewer: ['complete', 'Review concerns are visible in the audit trail.']
    },
    messages: [
      ['orchestrator', 'reviewer', 'observability', 'The event stream is the lightweight audit trail for the PoC.'],
      ['reviewer', 'orchestrator', 'approval', 'Risks are labeled clearly and the scoped simulation can complete.']
    ],
    notes: [
      'Observability is represented by chronological events and directed messages.',
      'The demo remains in-memory and intentionally avoids external infrastructure.'
    ]
  },
  {
    stageId: 'complete',
    headline: 'Lifecycle completes with a stable snapshot',
    updates: {
      orchestrator: ['complete', 'Demo lifecycle completed and ready to reset or replay.'],
      researcher: ['complete', 'No additional context required.'],
      coder: ['complete', 'No further implementation steps queued.'],
      reviewer: ['complete', 'No blocking production concerns remain for this PoC.']
    },
    messages: [
      ['orchestrator', 'coder', 'closure', 'Stop advancing; the deterministic story is complete.'],
      ['orchestrator', 'researcher', 'closure', 'Archive the simulated research-team collaboration notes.']
    ],
    notes: [
      'Completion is idempotent: additional steps keep the final snapshot stable.',
      'Users can reset to replay the same deterministic lifecycle.'
    ]
  }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createAgents() {
  return agentBlueprints.map((agent) => ({
    ...agent,
    state: agent.id === 'orchestrator' ? 'planning' : 'idle',
    activeTask:
      agent.id === 'orchestrator'
        ? 'Frame the lifecycle and prepare the first scoped delegation.'
        : 'Waiting for a scoped request.',
    lastMessage: 'Ready for deterministic simulation.'
  }));
}

function stageIndexFor(stageId) {
  return lifecycleStages.findIndex((stage) => stage.id === stageId);
}

function buildTimeline(currentStageId) {
  const currentIndex = stageIndexFor(currentStageId);

  return lifecycleStages.map((stage, index) => ({
    ...stage,
    status: index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'upcoming'
  }));
}

function createEvent({ tick, kind, title, detail, from, to, messageType, sequence = 0 }) {
  return {
    id: `evt-${sequence}-${tick}-${kind}-${from ?? 'system'}-${to ?? 'team'}`,
    tick,
    kind,
    title,
    detail,
    from,
    to,
    messageType,
    timestamp: `T+${String(tick).padStart(2, '0')}`
  };
}

function getAgentName(agentId) {
  return agentBlueprints.find((agent) => agent.id === agentId)?.name ?? 'System';
}

function appendEvent(simulation, event) {
  simulation.events.push(createEvent({ ...event, sequence: simulation.eventCounter }));
  simulation.eventCounter += 1;
}

export function createSimulation() {
  const initialEvent = createEvent({
    tick: 0,
    kind: 'lifecycle',
    title: 'Simulation ready',
    detail: 'The orchestrator has framed the goal and is ready to start the agent lifecycle.',
    sequence: 0
  });

  return {
    started: false,
    tick: 0,
    currentStageId: 'discover',
    agents: createAgents(),
    messages: [],
    events: [initialEvent],
    eventCounter: 1,
    completed: false
  };
}

export function snapshotSimulation(simulation) {
  return {
    started: simulation.started,
    tick: simulation.tick,
    completed: simulation.completed,
    currentStage: lifecycleStages[stageIndexFor(simulation.currentStageId)],
    timeline: buildTimeline(simulation.currentStageId),
    agents: clone(simulation.agents),
    messages: clone(simulation.messages),
    events: clone(simulation.events)
  };
}

export function startSimulation(simulation = createSimulation()) {
  const next = clone(simulation);

  if (!next.started) {
    next.started = true;
    appendEvent(next, {
      tick: next.tick,
      kind: 'control',
      title: 'Lifecycle started',
      detail: 'The user started the deterministic multi-agent demo.'
    });
  }

  return next;
}

export function advanceSimulation(simulation) {
  const next = startSimulation(simulation);

  if (next.completed) {
    appendEvent(next, {
      tick: next.tick,
      kind: 'control',
      title: 'Step ignored after completion',
      detail: 'Reset the demo to replay the deterministic lifecycle.'
    });
    return next;
  }

  const script = stepScripts[next.tick] ?? stepScripts.at(-1);
  const nextTick = next.tick + 1;
  next.tick = nextTick;
  next.currentStageId = script.stageId;

  next.agents = next.agents.map((agent) => {
    const update = script.updates[agent.id];
    if (!update) {
      return agent;
    }

    return {
      ...agent,
      state: update[0],
      activeTask: update[1]
    };
  });

  appendEvent(next, {
    tick: nextTick,
    kind: 'lifecycle',
    title: script.headline,
    detail: lifecycleStages[stageIndexFor(script.stageId)].summary
  });

  script.messages.forEach(([from, to, messageType, body], index) => {
    const message = {
      id: `msg-${nextTick}-${index + 1}`,
      tick: nextTick,
      from,
      to,
      fromName: getAgentName(from),
      toName: getAgentName(to),
      type: messageType,
      body
    };
    next.messages.push(message);
    appendEvent(next, {
      tick: nextTick,
      kind: 'message',
      title: `${message.fromName} → ${message.toName}`,
      detail: body,
      from,
      to,
      messageType
    });
  });

  script.notes.forEach((detail, index) => {
    appendEvent(next, {
      tick: nextTick,
      kind: 'insight',
      title: `Design note ${index + 1}`,
      detail
    });
  });

  next.agents = next.agents.map((agent) => {
    const latestMessage = [...next.messages].reverse().find((message) => message.from === agent.id || message.to === agent.id);
    return {
      ...agent,
      lastMessage: latestMessage
        ? `${latestMessage.fromName} → ${latestMessage.toName}: ${latestMessage.body}`
        : agent.lastMessage
    };
  });

  if (script.stageId === 'complete') {
    next.completed = true;
  }

  return next;
}

export function resetSimulation() {
  return createSimulation();
}

export { agentBlueprints, lifecycleStages };
