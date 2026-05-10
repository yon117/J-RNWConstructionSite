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
      EMAIL_TO: 'julioramirez@jandrnw.com',
      ADMIN_SESSION_SECRET: '26885aa148a9743df0f7f471fe690cafacb3e8b84bdf7bcc592f85fe64aad543',
      ANTHROPIC_API_KEY: '',
      YELP_API_KEY: '44cKv5irpE_r95-FYXYqtF6QO536-Ptqy3lxZQ_h3CoBYId6ghtgVrlSFGPdO9rJgcCW0K2_pOjOyQA9SXqjt5VTmdZRYApa7Ao6CvNpPG9AU2g3m28hCuKJ0u9vaXYx',
      YELP_BUSINESS_ID: 'j-and-r-nw-construction-portland-5',
      GOOGLE_OAUTH_CLIENT_ID: '',
      GOOGLE_OAUTH_CLIENT_SECRET: '',
      GOOGLE_GA4_PROPERTY_ID: '497147554'
    }
  }]
}
