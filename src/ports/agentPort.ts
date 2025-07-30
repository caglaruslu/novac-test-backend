import { Agent } from '../domain/agent';

export interface AgentPort {
  getAll(): Promise<Agent[]>;
  getById(id: string): Promise<Agent | undefined>;
  add(agent: Agent): Promise<Agent>;
  update(agent: Agent): Promise<Agent>;
  delete(id: string): Promise<void>;
}
