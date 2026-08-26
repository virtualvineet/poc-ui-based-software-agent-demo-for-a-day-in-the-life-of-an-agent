import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';
import { advanceSimulation, createSimulation, snapshotSimulation, startSimulation } from '../server/agentSimulation.js';

function mockJsonResponse(body, ok = true) {
  return Promise.resolve({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(body)
  });
}

describe('App', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders lifecycle stages, agents, events, and controls from the API snapshot', async () => {
    const initialSnapshot = snapshotSimulation(createSimulation());
    fetch.mockResolvedValueOnce(await mockJsonResponse(initialSnapshot));

    render(<App />);

    expect(await screen.findByRole('heading', { name: /agent lifecycle collaboration demo/i })).toBeInTheDocument();
    expect(screen.getAllByText('Discover').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next Step' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Auto Play' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();

    ['Orchestrator', 'Researcher', 'Coder', 'Reviewer'].forEach((name) => {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument();
    });
    expect(screen.getByText('Simulation ready')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/demo/state', undefined);
  });

  it('calls start, step, and reset endpoints and renders returned collaboration messages', async () => {
    const initialSimulation = createSimulation();
    const startedSimulation = startSimulation(initialSimulation);
    const steppedSimulation = advanceSimulation(startedSimulation);

    fetch
      .mockResolvedValueOnce(await mockJsonResponse(snapshotSimulation(initialSimulation)))
      .mockResolvedValueOnce(await mockJsonResponse(snapshotSimulation(startedSimulation)))
      .mockResolvedValueOnce(await mockJsonResponse(snapshotSimulation(steppedSimulation)))
      .mockResolvedValueOnce(await mockJsonResponse(snapshotSimulation(createSimulation())));

    render(<App />);
    await screen.findByText('Simulation ready');

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/demo/start', { method: 'POST' }));
    expect(await screen.findByRole('button', { name: 'Started' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Next Step' }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/demo/step', { method: 'POST' }));
    expect(await screen.findByText('Orchestrator chooses a coordination pattern')).toBeInTheDocument();
    expect(screen.getAllByText(/Map MCP as the tool\/data layer/i).length).toBeGreaterThan(0);
    expect(screen.getByText('2 messages')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/demo/reset', { method: 'POST' }));
    expect(await screen.findByRole('button', { name: 'Start' })).toBeEnabled();
  });

  it('auto play advances until the returned snapshot is complete', async () => {
    let simulation = createSimulation();
    const finalSimulation = Array.from({ length: 6 }).reduce((current) => advanceSimulation(current), simulation);

    fetch
      .mockResolvedValueOnce(await mockJsonResponse(snapshotSimulation(simulation)))
      .mockResolvedValueOnce(await mockJsonResponse(snapshotSimulation(finalSimulation)));

    render(<App />);
    await screen.findByText('Simulation ready');

    const intervalSpy = vi.spyOn(window, 'setInterval').mockImplementation((callback) => {
      callback();
      return 1;
    });
    vi.spyOn(window, 'clearInterval').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: 'Auto Play' }));
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();

    await waitFor(() => expect(intervalSpy).toHaveBeenCalled());
    expect(await screen.findByText('Lifecycle completes with a stable snapshot')).toBeInTheDocument();
    expect(screen.getAllByText('Complete').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Auto Play' })).toBeDisabled();
  });

  it('shows a visible API error when the backend cannot be reached', async () => {
    fetch.mockRejectedValueOnce(new Error('network down'));

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load agent demo state: network down');
  });
});
