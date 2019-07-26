import { Sequelize } from 'sequelize-typescript';

import config from '../config';
import { Event, Venue } from '../models';

const { db } = config;

const sequelize =  new Sequelize(
  db.name,
  db.user,
  db.pwd,
  {
    host: db.host,
    dialect: 'postgres'
  }
);

sequelize.addModels([Event, Venue]);

// const models = {
//   User: sequelize.import('./user'),
//   Course: sequelize.import('./course'),
//   StudentCourses: sequelize.import('./studentCourses')
// }

// Object.keys(models).forEach(key => {
//   if('associate' in models[key]) {
//     models[key].associate(models)
//   }
// })

export {
  sequelize,
};

// export default models
