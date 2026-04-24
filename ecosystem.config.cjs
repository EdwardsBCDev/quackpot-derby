module.exports = {
  apps: [
    {
      name: "quackpot-derby",
      script: "src/server.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
        PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || ""
      }
    }
  ]
};
