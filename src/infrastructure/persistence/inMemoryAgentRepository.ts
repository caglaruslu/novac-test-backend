import { Agent } from '../../domain/agent';
import { AgentPort } from '../../ports/agentPort';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../../domain/errors';

export class InMemoryAgentRepository implements AgentPort {
  private agents: Agent[] = [];

  async getAll(): Promise<Agent[]> {
    return this.agents;
  }

  async getById(id: string): Promise<Agent | undefined> {
    return this.agents.find(agent => agent.id === id);
  }

  async add(agent: Agent): Promise<Agent> {
    const newAgent = { ...agent, id: agent.id || uuidv4() };
    this.agents.push(newAgent);
    return newAgent;
  }

  async update(agent: Agent): Promise<Agent> {
    const index = this.agents.findIndex(a => a.id === agent.id);
    if (index === -1) throw new NotFoundError('Agent not found');
    this.agents[index] = { ...this.agents[index], ...agent };
    return this.agents[index];
  }

  async delete(id: string): Promise<void> {
    this.agents = this.agents.filter(agent => agent.id !== id);
  }
}
