import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from './routes/api.js';
import { validateApiKey } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', validateApiKey, apiRoutes);
app.use(errorHandler);

const port = Number(process.env.PORT ?? 3001);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Hybrid RAG backend listening on ${port}`);
  });
}

export default app;
