import { LRUCache } from 'lru-cache';

const rateLimit = {
  tokenCache: new LRUCache({
    max: 500,
    ttl: 60 * 1000, // 1 minute
  }),

  check: (req, limit, token) => {
    const tokenCount = rateLimit.tokenCache.get(token) || [0];
    if (tokenCount[0] === 0) {
      rateLimit.tokenCache.set(token, [1]);
      return true;
    }
    if (tokenCount[0] < limit) {
      rateLimit.tokenCache.set(token, [tokenCount[0] + 1]);
      return true;
    }
    return false;
  },
};

export default rateLimit; 