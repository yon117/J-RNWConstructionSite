module.exports = {
  apps: [{
    name: 'jandr',
    script: 'npm',
    args: 'start',
    cwd: '/root/jandr',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
