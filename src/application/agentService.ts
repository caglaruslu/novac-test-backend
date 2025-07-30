import { Agent } from '../domain/agent';
import { AgentRepository } from '../domain/agentRepository';
import { HotelQAPort } from '../ports/hotelQAPort';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ValidationError } from '../domain/errors';

export class AgentService {
  constructor(
    private agentRepository: AgentRepository,
    private hotelQABot?: HotelQAPort
  ) {}

  async getAllAgents(): Promise<Agent[]> {
    return this.agentRepository.getAll();
  }

  async getAgentById(id: string): Promise<Agent | undefined> {
    return this.agentRepository.getById(id);
  }

  async addAgent(agent: Omit<Agent, 'id'>): Promise<Agent> {
    const agentWithId: Agent = {
      ...agent,
      id: uuidv4(),
    };
    return this.agentRepository.add(agentWithId);
  }

  async updateAgent(agent: Agent): Promise<Agent> {
    return this.agentRepository.update(agent);
  }

  async deleteAgent(id: string): Promise<void> {
    return this.agentRepository.delete(id);
  }

  async askHotelQABot(agentId: string, question: string): Promise<string> {
    const agent = await this.agentRepository.getById(agentId);
    if (!agent) {
      throw new NotFoundError('Agent not found');
    }
    if (!this.hotelQABot) {
      throw new NotFoundError('Hotel Q&A Bot not available');
    }
    return this.hotelQABot.ask(question);
  }
}
