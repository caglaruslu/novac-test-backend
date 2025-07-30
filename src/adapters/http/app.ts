import express from 'express';
import cors from 'cors';
import { JsonFileAgentRepository } from '../../infrastructure/persistence/jsonFileAgentRepository';
import { HotelQABotService } from '../../application/hotelQABotService';
import { AgentService } from '../../application/agentService';
import { createAgentRouter } from './agentController';
import { createHotelQABotRouter } from './hotelQABotController';
import { AppError, NotFoundError, ValidationError } from '../../domain/errors';
import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(cors());
app.use(express.json());

// Dependency injection
const agentRepository = new JsonFileAgentRepository();
const hotelQABot = new HotelQABotService();
const agentService = new AgentService(agentRepository, hotelQABot);

// Mount routers
app.use('/agents', createAgentRouter(agentService));
app.use('/agents', createHotelQABotRouter(agentService));

// Centralized error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default app; 