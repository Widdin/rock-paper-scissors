import express from 'express';
import routes from './routes/index';
import { expressLogger } from './utils/logger';

const app = express();

app.use(expressLogger);
app.use(express.json());
app.use('/api/games', routes);

export default app;
