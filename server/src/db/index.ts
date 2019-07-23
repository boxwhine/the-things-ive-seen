import mongoose from 'mongoose';
import querystring from 'querystring';
 
// Set up Mongoose Promises.
mongoose.Promise = global.Promise;

interface DbArgs {
  user: string;
  pwd: string;
  url: string;
  db: string;
  /**
   * an array of key value pair strings
   * @example ["foo=bar"]
   */
  options: string[];
}

export const startDB = async (args: DbArgs) => {
  const { user, pwd, url, db, options } = args;
  const opts = {
    authSource: 'admin',
    retryWrites: true,
    ssl: true,
    useNewUrlParser: true,
    ...options.reduce((acc, opt) => {
      const [k, v] = opt.split('=');
      return {
        ...acc,
        [k]: v,
      };
    }, {}),
  };

  return mongoose.connect(
      `mongodb+srv://${querystring.escape(user)}:${querystring.escape(pwd)}@${url}/${db}`,
      opts
    )
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));
};
