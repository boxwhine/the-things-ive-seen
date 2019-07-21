import * as eventQueries from './events';
import * as venueQueries from './venues';

export default {
  ...eventQueries,
  ...venueQueries,
};
