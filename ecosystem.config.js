module.exports = {
  apps: [{
    name: 'jandr',
    script: 'npm',
    args: 'start',
    cwd: '/root/jandr',
    env: {
      NODE_ENV: 'production',
      TURSO_DATABASE_URL: 'libsql://jandr-construction-yon117.aws-us-east-1.turso.io',
      TURSO_AUTH_TOKEN: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzE0NzkyNjMsImlkIjoiYTQ3OTUxNTUtM2QxOS00ZDYwLWE4MGUtY2FjMzgxYWFlMDg5IiwicmlkIjoiMDdlZmNkOTktYTZmNC00ZGFlLTk3YWEtYjE0YWI2M2QyNGJhIn0.UFP-sD-zADp1M7qJ4Z6BBwK_pcmRjSSamhEkdwt7tuhN2hd2zasggx5XB7LYUuK0oUl-A7Gr4koSQ_0_QF1iDg',
      EMAIL_USER: 'julioramirez@jandrnw.com',
      EMAIL_PASS: 'Turmoilguy11!',
      EMAIL_TO: 'julioramirez@jandrnw.com'
    }
  }]
}
