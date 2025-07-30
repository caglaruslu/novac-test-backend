import { promises as fs } from 'fs';
import path from 'path';
import { Agent } from '../../domain/agent';
import { AgentPort } from '../../ports/agentPort';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ValidationError } from '../../domain/errors';

const DATA_PATH = path.resolve(__dirname, '../../../data/agents.json');

export class JsonFileAgentRepository implements AgentPort {
  private async readAgents(): Promise<Agent[]> {
    try {
      const data = await fs.readFile(DATA_PATH, 'utf-8');
      return JSON.parse(data) as Agent[];
    } catch (err: any) {
      if (err.code === 'ENOENT') return [];
      console.error('JsonFileAgentRepository.readAgents error:', err);
      throw err;
    }
  }

  private async writeAgents(agents: Agent[]): Promise<void> {
    try {
      await fs.writeFile(DATA_PATH, JSON.stringify(agents, null, 2), 'utf-8');
    } catch (err) {
      console.error('JsonFileAgentRepository.writeAgents error:', err);
      throw err;
    }
  }

  async getAll(): Promise<Agent[]> {
    return this.readAgents();
  }

  async getById(id: string): Promise<Agent | undefined> {
    const agents = await this.readAgents();
    return agents.find(agent => agent.id === id);
  }

  async add(agent: Agent): Promise<Agent> {
    const agents = await this.readAgents();
    const newAgent = { ...agent, id: agent.id || uuidv4() };
    agents.push(newAgent);
    await this.writeAgents(agents);
    return newAgent;
  }

  async update(agent: Agent): Promise<Agent> {
    const agents = await this.readAgents();
    const index = agents.findIndex(a => a.id === agent.id);
    if (index === -1) throw new NotFoundError('Agent not found');
    agents[index] = { ...agents[index], ...agent };
    await this.writeAgents(agents);
    return agents[index];
  }

  async delete(id: string): Promise<void> {
    const agents = await this.readAgents();
    const filtered = agents.filter(agent => agent.id !== id);
    await this.writeAgents(filtered);
  }
}
