import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  advanceSimulation,
  createSimulation,
  resetSimulation,
  snapshotSimulation,
  startSimulation
} from './agentSimulation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '..', 'dist');

export function createApp() {
  const app = express();
  let simulation = createSimulation();

  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ ok: true, service: 'agent-lifecycle-demo' });
  });

  app.get('/api/demo/state', (_request, response) => {
    response.json(snapshotSimulation(simulation));
  });

  app.post('/api/demo/start', (_request, response) => {
    simulation = startSimulation(simulation);
    response.json(snapshotSimulation(simulation));
  });

  app.post('/api/demo/step', (_request, response) => {
    simulation = advanceSimulation(simulation);
    response.json(snapshotSimulation(simulation));
  });

  app.post('/api/demo/reset', (_request, response) => {
    simulation = resetSimulation();
    response.json(snapshotSimulation(simulation));
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(distPath));
    app.get(/^(?!\/api).*/, (_request, response) => {
      response.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const port = process.env.PORT ?? 3001;
  createApp().listen(port, () => {
    console.log(`Agent lifecycle API listening on http://localhost:${port}`);
  });
}
