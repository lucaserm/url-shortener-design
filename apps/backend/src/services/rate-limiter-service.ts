export interface RateLimiterService {
  isRateLimited(key: string): Promise<boolean>;
}
