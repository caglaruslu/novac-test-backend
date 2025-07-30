import Fuse from 'fuse.js';
import { hotelQAPairs, QAPair } from '../domain/hotelQABot';
import { HotelQAPort } from '../ports/hotelQAPort';

const FUSE_THRESHOLD = 0.64; // Lower = stricter, higher = fuzzier
const FUSE_ACCEPTABLE_SCORE = 0.8; // Lower = better match

export class HotelQABotService implements HotelQAPort {
  private fuse: Fuse<QAPair>;
  private fallback = "Sorry, I couldn’t find an answer to that.";

  constructor(pairs: QAPair[] = hotelQAPairs) {
    this.fuse = new Fuse(pairs, {
      keys: ['question'],
      threshold: FUSE_THRESHOLD,
      includeScore: true,
    });
  }

  async ask(question: string): Promise<string> {
    const result = this.fuse.search(question);
    if (result.length > 0 && result[0].score !== undefined && result[0].score < FUSE_ACCEPTABLE_SCORE) {
      return result[0].item.answer;
    }
    return this.fallback;
  }
} 