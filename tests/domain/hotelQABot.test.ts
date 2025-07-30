import { HotelQABotService } from '../../src/application/hotelQABotService';
import { QAPair } from '../../src/domain/hotelQABot';

describe('HotelQABotService', () => {
  const mockPairs: QAPair[] = [
    { question: 'check-in', answer: 'Check-in is at 2 PM.' },
    { question: 'breakfast', answer: 'Breakfast is served from 7 to 10.' }
  ];

  it('returns correct answer for exact match', async () => {
    const bot = new HotelQABotService(mockPairs);
    const answer = await bot.ask('check-in');
    expect(answer).toBe('Check-in is at 2 PM.');
  });

  it('returns correct answer for fuzzy match with similar keyword', async () => {
    const bot = new HotelQABotService(mockPairs);
    const answer = await bot.ask('check in time');
    expect(answer).toBe('Check-in is at 2 PM.');
  });

  it('returns correct answer for fuzzy match', async () => {
    const bot = new HotelQABotService(mockPairs);
    const answer = await bot.ask('When is breakfast?');
    expect(answer).toBe('Breakfast is served from 7 to 10.');
  });

  it('returns fallback for unknown question', async () => {
    const bot = new HotelQABotService(mockPairs);
    const answer = await bot.ask('Do you have a swimming pool?');
    expect(answer).toMatch(/sorry/i);
  });
});
