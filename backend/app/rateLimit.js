const buckets = new Map();

function rateLimit({ windowMs = 15 * 60 * 1000, max = 60, keyGenerator = (req) => req.ip || "unknown", message = "Too many requests. Please try again later." } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = keyGenerator(req);
    const current = buckets.get(key);
    if (!current || now - current.start >= windowMs) {
      buckets.set(key, { start: now, count: 1 });
      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, max - 1));
      return next();
    }
    current.count += 1;
    const remaining = Math.max(0, max - current.count);
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);
    if (current.count > max) {
      res.setHeader("Retry-After", Math.ceil((windowMs - (now - current.start)) / 1000));
      return res.status(429).json({ message });
    }
    next();
  };
}

setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [key, bucket] of buckets) if (bucket.start < cutoff) buckets.delete(key);
}, 10 * 60 * 1000).unref();

module.exports = rateLimit;
