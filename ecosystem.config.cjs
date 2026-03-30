/**
 * PM2 process file — API only (recommended for production).
 * Serve the built client with Nginx/Caddy (client/dist), not Vite dev.
 *
 * Usage:
 *   cd /path/to/WiseWork
 *   pm2 start ecosystem.config.cjs
 *   pm2 save && pm2 startup
 *
 * Env: copy server/.env — PM2 does not load .env automatically; vars can be
 * inlined in `env` below or use dotenv in the app (already uses dotenv in server).
 */
module.exports = {
  apps: [
    {
      name: "wisework-api",
      cwd: __dirname + "/server",
      script: "node",
      args: "./node_modules/tsx/dist/cli.mjs src/index.ts",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
