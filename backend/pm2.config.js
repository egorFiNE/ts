module.exports = {
	apps : [
    {
      name: "ts-backend",
			namespace: "ts",
      script: 'index.mjs',
      kill_timeout: 12 * 1000,
      restart_delay: 6 * 1000,
      autorestart: true,
      max_restarts: 0,
      watch: false,
      wait_ready: true,

      env: {
        TZ: 'UTC',
        NODE_ENV: 'production'
      }
    }
  ]
};
