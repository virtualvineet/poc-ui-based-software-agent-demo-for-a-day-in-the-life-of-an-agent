import request from 'supertest';
import { describe, expect, it } from 'vitest';
import {
  advanceSimulation,
  createSimulation,
  resetSimulation,
  snapshotSimulation,
  startSimulation
} from './agentSimulation.js';
import { createApp } from './index.js';

describe('agent simulation', () => {
  it('creates an initial discover snapshot with all demo agents', () => {
    const snapshot = snapshotSimulation(createSimulation());

    expect(snapshot.started).toBe(false);
    expect(snapshot.currentStage.id).toBe('discover');
    expect(snapshot.timeline.find((stage) => stage.id === 'discover').status).toBe('current');
    expect(snapshot.agents.map((agent) => agent.id)).toEqual(['orchestrator', 'researcher', 'coder', 'reviewer']);
    expect(snapshot.events).toHaveLength(1);
    expect(snapshot.events[0].title).toBe('Simulation ready');
  });

  it('starts once and advances through deterministic messages and lifecycle stages', () => {
    let simulation = createSimulation();
    simulation = startSimulation(simulation);
    simulation = startSimulation(simulation);

    let snapshot = snapshotSimulation(simulation);
    expect(snapshot.started).toBe(true);
    expect(snapshot.events.filter((event) => event.title === 'Lifecycle started')).toHaveLength(1);

    simulation = advanceSimulation(simulation);
    snapshot = snapshotSimulation(simulation);

    expect(snapshot.tick).toBe(1);
    expect(snapshot.currentStage.id).toBe('plan');
    expect(snapshot.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ from: 'orchestrator', to: 'researcher', type: 'delegation' }),
        expect.objectContaining({ from: 'orchestrator', to: 'coder', type: 'delegation' })
      ])
    );
    expect(snapshot.agents.find((agent) => agent.id === 'researcher').state).toBe('communicating');
    expect(snapshot.events.some((event) => event.detail.includes('orchestrator-worker delegation'))).toBe(true);

    simulation = advanceSimulation(simulation);
    snapshot = snapshotSimulation(simulation);

    expect(snapshot.currentStage.id).toBe('research');
    expect(snapshot.messages).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'tool-result' })]));
    expect(snapshot.events.some((event) => event.detail.includes('MCP is represented'))).toBe(true);
  });

  it('completes after the scripted lifecycle and then remains complete until reset', () => {
    let simulation = createSimulation();

    for (let index = 0; index < 6; index += 1) {
      simulation = advanceSimulation(simulation);
    }

    const completedSnapshot = snapshotSimulation(simulation);
    expect(completedSnapshot.completed).toBe(true);
    expect(completedSnapshot.currentStage.id).toBe('complete');
    expect(completedSnapshot.agents.every((agent) => agent.state === 'complete')).toBe(true);

    const ignoredStepSnapshot = snapshotSimulation(advanceSimulation(simulation));
    expect(ignoredStepSnapshot.completed).toBe(true);
    expect(ignoredStepSnapshot.currentStage.id).toBe('complete');
    expect(ignoredStepSnapshot.events.at(-1).title).toBe('Step ignored after completion');

    const resetSnapshot = snapshotSimulation(resetSimulation());
    expect(resetSnapshot.completed).toBe(false);
    expect(resetSnapshot.currentStage.id).toBe('discover');
    expect(resetSnapshot.tick).toBe(0);
  });
});

describe('agent lifecycle API', () => {
  it('exposes health, state, step, and reset endpoints backed by the same simulation', async () => {
    const app = createApp();

    await request(app).get('/api/health').expect(200).expect(({ body }) => {
      expect(body).toEqual({ ok: true, service: 'agent-lifecycle-demo' });
    });

    await request(app).get('/api/demo/state').expect(200).expect(({ body }) => {
      expect(body.currentStage.id).toBe('discover');
      expect(body.agents).toHaveLength(4);
    });

    await request(app).post('/api/demo/step').expect(200).expect(({ body }) => {
      expect(body.started).toBe(true);
      expect(body.currentStage.id).toBe('plan');
      expect(body.messages).toHaveLength(2);
    });

    await request(app).post('/api/demo/reset').expect(200).expect(({ body }) => {
      expect(body.started).toBe(false);
      expect(body.currentStage.id).toBe('discover');
      expect(body.messages).toHaveLength(0);
    });
  });
});
