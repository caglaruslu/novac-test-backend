import express from 'express';
import { AgentService } from '../../application/agentService';
import { z } from 'zod';
import { Agent } from '../../domain/agent';
import { NotFoundError, ValidationError } from '../../domain/errors';

export const AgentSchema = z.object({
  name: z.string(),
  type: z.enum(['Sales', 'Support', 'Marketing']),
  status: z.enum(['Active', 'Inactive']),
  description: z.string().optional(),
});

export type AgentPayload = z.infer<typeof AgentSchema>;

export function createAgentRouter(agentService: AgentService) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const agents = await agentService.getAllAgents();
      res.json(agents);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const agent = await agentService.getAgentById(req.params.id);
      if (!agent) return next(new NotFoundError('Agent not found'));
      res.json(agent);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    const result = AgentSchema.safeParse(req.body);
    if (!result.success) {
      return next(new ValidationError('Invalid agent payload'));
    }
    try {
      const agent = await agentService.addAgent(result.data);
      res.status(201).json(agent);
    } catch (err) {
      next(err);
    }
  });

  router.put('/:id', async (req, res, next) => {
    const result = AgentSchema.safeParse(req.body);
    if (!result.success) {
      return next(new ValidationError('Invalid agent payload'));
    }
    try {
      const agent = await agentService.updateAgent({ ...result.data, id: req.params.id });
      res.json(agent);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      await agentService.deleteAgent(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
