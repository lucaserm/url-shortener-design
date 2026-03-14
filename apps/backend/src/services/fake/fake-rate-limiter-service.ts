import type { RateLimiterService } from "../rate-limiter-service";

export class FakeRateLimiterService implements RateLimiterService {
  private limited = false;

  setLimited(limited: boolean) {
    this.limited = limited;
  }

  async isRateLimited(): Promise<boolean> {
    return this.limited;
  }
}
