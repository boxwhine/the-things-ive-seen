import { combineReducers } from 'redux';
import counter from './counter';
import events from '../containers/events/reducer';
import venues from '../containers/venues/reducer';

export default combineReducers({
  counter,
  events,
  venues,
});
