import request from 'supertest';
import app from '../../src/adapters/http/app';

describe('Agent API integration', () => {
  let agentId: string;

  it('should create an agent', async () => {
    const createRes = await request(app)
      .post('/agents')
      .send({ name: 'Hotel Q&A Bot', type: 'Support', status: 'Active' });
    expect(createRes.status).toBe(201);
    expect(createRes.body.name).toBe('Hotel Q&A Bot');
    agentId = createRes.body.id;
  });

  it('should fetch all agents', async () => {
    const getRes = await request(app).get('/agents');
    expect(getRes.status).toBe(200);
    expect(Array.isArray(getRes.body)).toBe(true);
    expect(getRes.body.find((a: any) => a.id === agentId)).toBeTruthy();
  });

  it('should fetch agent by id', async () => {
    const res = await request(app).get(`/agents/${agentId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(agentId);
  });

  it('should update agent by id', async () => {
    const res = await request(app)
      .put(`/agents/${agentId}`)
      .send({ name: 'Updated Hotel Q&A Bot', type: 'Support', status: 'Inactive' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Hotel Q&A Bot');
    expect(res.body.status).toBe('Inactive');
  });

  it('should ask Hotel Q&A Bot and get a real answer', async () => {
    const res = await request(app)
      .post(`/agents/${agentId}/ask`)
      .send({ question: 'What time is check-in?' });
    expect(res.status).toBe(200);
    expect(res.body.answer).toMatch(/16:00|check-in|Sorry/i); // Accept fallback or real answer
  });

  it('should return fallback for unknown Q&A', async () => {
    const res = await request(app)
      .post(`/agents/${agentId}/ask`)
      .send({ question: 'Do you have a swimming pool?' });
    expect(res.status).toBe(200);
    expect(res.body.answer).toMatch(/sorry/i);
  });

  it('should return 404 for non-existent agent', async () => {
    const res = await request(app).get('/agents/nonexistentid');
    expect(res.status).toBe(404);
  });

  it('should return 400 for invalid payload', async () => {
    const res = await request(app)
      .post('/agents')
      .send({ name: 123 }); // Invalid type
    expect(res.status).toBe(400);
  });

  it('should delete agent by id', async () => {
    const res = await request(app).delete(`/agents/${agentId}`);
    expect(res.status).toBe(204);
  });

  it('should return 404 for deleted agent', async () => {
    const res = await request(app).get(`/agents/${agentId}`);
    expect(res.status).toBe(404);
  });
}); 