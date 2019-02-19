const mongoose = require('mongoose');
const { Event } = require('./models');
 
// Set up Mongoose Promises.
mongoose.Promise = global.Promise;

const startDB = ({ user, pwd, url, db, options }) => {
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
    `mongodb://${user}:${pwd}@${url}/${db}`, opts)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
};
  
module.exports = {
  startDB,
};
