const {
  DB_OPTIONS,
  NODE_ENV,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
} = process.env!;

const config = {
  isProd: NODE_ENV === 'production',
  isDev: NODE_ENV !== 'production',
  db: {
    name: POSTGRES_DB!,
    options: !!DB_OPTIONS ? DB_OPTIONS.split('&') : [],
    pwd: POSTGRES_PASSWORD!,
    host: POSTGRES_HOST!,
    user: POSTGRES_USER!,
  },
};

export default config;
