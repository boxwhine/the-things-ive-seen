const { NODE_ENV } = process.env;

const config = {
  isProd: NODE_ENV === "production",
  isDev: NODE_ENV !== "production",
};

export default config;
