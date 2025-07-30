export interface HotelQAPort {
  ask(question: string): Promise<string>;
}
