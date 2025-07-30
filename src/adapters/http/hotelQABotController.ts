import express from 'express';
import { AgentService } from '../../application/agentService';
import { ValidationError } from '../../domain/errors';

export function createHotelQABotRouter(agentService: AgentService) {
  const router = express.Router();

  router.post('/:id/ask', async (req, res, next) => {
    const { question } = req.body;
    if (!question) return next(new ValidationError('Question is required'));
    try {
      const answer = await agentService.askHotelQABot(req.params.id, question);
      res.json({ answer });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
