export type AgentType = 'Sales' | 'Support' | 'Marketing';
export type AgentStatus = 'Active' | 'Inactive';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  description?: string;
}
