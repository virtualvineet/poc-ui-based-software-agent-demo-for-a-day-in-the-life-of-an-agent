import { useCallback, useEffect, useMemo, useState } from 'react';
import AgentBoard from './components/AgentBoard.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import EventLog from './components/EventLog.jsx';
import LifecycleTimeline from './components/LifecycleTimeline.jsx';

const AUTO_PLAY_INTERVAL_MS = 900;

async function requestSnapshot(path, options) {
  const response = await fetch(path, options);
  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}`);
  }
  return response.json();
}

export default function App() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState(null);
  const [error, setError] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);

  const loadState = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setSnapshot(await requestSnapshot('/api/demo/state'));
    } catch (requestError) {
      setError(`Unable to load agent demo state: ${requestError.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const runAction = useCallback(async (action, path) => {
    setBusyAction(action);
    setError('');
    try {
      const nextSnapshot = await requestSnapshot(path, { method: 'POST' });
      setSnapshot(nextSnapshot);
      if (nextSnapshot.completed) {
        setAutoPlay(false);
      }
    } catch (requestError) {
      setAutoPlay(false);
      setError(`Unable to ${action} simulation: ${requestError.message}`);
    } finally {
      setBusyAction(null);
    }
  }, []);

  useEffect(() => {
    loadState();
  }, [loadState]);

  useEffect(() => {
    if (!autoPlay || snapshot?.completed) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      runAction('advance', '/api/demo/step');
    }, AUTO_PLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [autoPlay, runAction, snapshot?.completed]);

  const latestEvents = useMemo(() => snapshot?.events.slice().reverse() ?? [], [snapshot]);
  const currentStageLabel = snapshot?.currentStage?.label ?? 'Loading';

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="demo-title">
        <div>
          <p className="eyebrow">Deterministic PoC · no real LLM or MCP calls</p>
          <h1 id="demo-title">Agent lifecycle collaboration demo</h1>
          <p className="hero-copy">
            Watch an orchestrator, researcher, coder, and reviewer move through a software-agent lifecycle with
            directed messages, simulated MCP tool/data context, and production-readiness checkpoints.
          </p>
        </div>
        <div className="stage-summary" aria-live="polite">
          <span>Current stage</span>
          <strong>{currentStageLabel}</strong>
          <small>Tick {snapshot?.tick ?? '—'}</small>
        </div>
      </section>

      {error ? <div className="alert" role="alert">{error}</div> : null}
      {loading ? <p className="loading">Loading agent demo state…</p> : null}

      {snapshot ? (
        <>
          <ControlPanel
            autoPlay={autoPlay}
            busyAction={busyAction}
            completed={snapshot.completed}
            started={snapshot.started}
            onStart={() => runAction('start', '/api/demo/start')}
            onStep={() => runAction('advance', '/api/demo/step')}
            onReset={() => {
              setAutoPlay(false);
              runAction('reset', '/api/demo/reset');
            }}
            onToggleAutoPlay={() => setAutoPlay((value) => !value)}
          />

          <section className="dashboard-grid">
            <LifecycleTimeline timeline={snapshot.timeline} />
            <AgentBoard agents={snapshot.agents} />
            <EventLog events={latestEvents} messages={snapshot.messages} />
          </section>
        </>
      ) : null}
    </main>
  );
}
