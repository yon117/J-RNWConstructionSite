const store = new Map();

export function rateLimit({ windowMs = 60_000, max = 10 } = {}) {
  return function check(key) {
    const now = Date.now();
    let record = store.get(key);
    if (!record || now - record.start > windowMs) {
      record = { count: 0, start: now };
    }
    record.count++;
    store.set(key, record);
    return record.count <= max;
  };
}
