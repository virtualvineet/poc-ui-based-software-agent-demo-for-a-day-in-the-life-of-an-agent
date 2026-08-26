export default function ControlPanel({
  autoPlay,
  busyAction,
  completed,
  started,
  onStart,
  onStep,
  onReset,
  onToggleAutoPlay
}) {
  const isBusy = Boolean(busyAction);

  return (
    <section className="panel controls" aria-label="Simulation controls">
      <div>
        <h2>Run controls</h2>
        <p>{completed ? 'The lifecycle is complete. Reset to replay it.' : 'Advance the deterministic story one step at a time or use auto play.'}</p>
      </div>
      <div className="button-row">
        <button type="button" onClick={onStart} disabled={isBusy || started}>
          {started ? 'Started' : 'Start'}
        </button>
        <button type="button" onClick={onStep} disabled={isBusy || completed}>
          Next Step
        </button>
        <button type="button" className={autoPlay ? 'secondary active' : 'secondary'} onClick={onToggleAutoPlay} disabled={isBusy || completed}>
          {autoPlay ? 'Pause' : 'Auto Play'}
        </button>
        <button type="button" className="ghost" onClick={onReset} disabled={isBusy}>
          Reset
        </button>
      </div>
      {busyAction ? <p className="busy" aria-live="polite">Working on {busyAction}…</p> : null}
    </section>
  );
}
