const logger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] --> ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const endTimestamp = new Date().toISOString();
    console.log(
      `[${endTimestamp}] <-- ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`
    );
  });

  next();
};

module.exports = logger;
