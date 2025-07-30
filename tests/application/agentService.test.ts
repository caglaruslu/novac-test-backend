import { AgentService } from '../../src/application/agentService';
import { Agent, AgentType, AgentStatus } from '../../src/domain/agent';

describe('AgentService', () => {
  let agents: Agent[];
  let mockRepo: any;
  let mockQABot: any;
  let service: AgentService;

  beforeEach(() => {
    agents = [
      { id: '1', name: 'Hotel Q&A Bot', type: 'Support' as AgentType, status: 'Active' as AgentStatus },
      { id: '2', name: 'Sales Agent', type: 'Sales' as AgentType, status: 'Active' as AgentStatus }
    ];
    mockRepo = {
      getAll: jest.fn().mockResolvedValue(agents),
      getById: jest.fn((id: string) => Promise.resolve(agents.find(a => a.id === id))),
      add: jest.fn((agent: Agent) => Promise.resolve({ ...agent, id: agent.id || '3' })),
      update: jest.fn((agent: Agent) => Promise.resolve(agent)),
      delete: jest.fn((id: string) => Promise.resolve())
    };
    mockQABot = { ask: jest.fn(() => Promise.resolve('answer')) };
    service = new AgentService(mockRepo, mockQABot);
  });

  it('gets all agents', async () => {
    const result = await service.getAllAgents();
    expect(result).toHaveLength(2);
  });

  it('gets agent by id', async () => {
    const result = await service.getAgentById('1');
    expect(result?.name).toBe('Hotel Q&A Bot');
  });

  it('adds an agent', async () => {
    const newAgent = { name: 'New Agent', type: 'Support' as AgentType, status: 'Active' as AgentStatus } as Agent;
    const result = await service.addAgent(newAgent);
    expect(result.name).toBe('New Agent');
  });

  it('updates an agent', async () => {
    const updated = { id: '1', name: 'Updated', type: 'Support' as AgentType, status: 'Active' as AgentStatus };
    const result = await service.updateAgent(updated);
    expect(result.name).toBe('Updated');
  });

  it('deletes an agent', async () => {
    await expect(service.deleteAgent('1')).resolves.toBeUndefined();
  });

  it('delegates Q&A to bot for hotel agent', async () => {
    const answer = await service.askHotelQABot('1', 'question');
    expect(answer).toBe('answer');
    expect(mockQABot.ask).toHaveBeenCalledWith('question');
  });

  it('throws for non-hotel agent Q&A', async () => {
    await expect(service.askHotelQABot('2', 'question')).rejects.toThrow('does not support Q&A');
  });
});
