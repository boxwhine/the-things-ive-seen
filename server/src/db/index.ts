import mongoose from 'mongoose';
import querystring from 'querystring';
 
// Set up Mongoose Promises.
mongoose.Promise = global.Promise;

export const startDB = async ({ user, pwd, url, db, options }) => {
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
    .catch(err => console.log(err));
};
