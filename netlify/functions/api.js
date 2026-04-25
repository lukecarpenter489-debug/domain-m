exports.handler = async (event) => {
  const domain = event.queryStringParameters?.domain;

  if (!domain) {
    return { statusCode: 400, body: "Missing domain" };
  }

  if (!process.env.UD_API_KEY) {
    return { statusCode: 500, body: "Missing API key" };
  }

  const res = await fetch(
    `https://resolve.unstoppabledomains.com/domains/${encodeURIComponent(domain)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.UD_API_KEY}`,
      },
    }
  );

  const data = await res.text();

  return {
    statusCode: res.status,
    headers: { "Content-Type": "application/json" },
    body: data,
  };
};
