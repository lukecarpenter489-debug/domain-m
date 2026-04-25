const rateLimitMap = new Map();

exports.handler = async function (event) {
  const ip =
    event.headers["client-ip"] ||
    event.headers["x-forwarded-for"] ||
    "unknown";

  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5; // 5 calls per minute

  const userData = rateLimitMap.get(ip) || {
    count: 0,
    startTime: now
  };

  if (now - userData.startTime > windowMs) {
    userData.count = 0;
    userData.startTime = now;
  }

  userData.count++;

  rateLimitMap.set(ip, userData);

  if (userData.count > maxRequests) {
    return {
      statusCode: 429,
      body: JSON.stringify({
        error: "Too many requests. Try again later."
      })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "API is working",
      requestsUsed: userData.count,
      limit: maxRequests
    })
  };
};
