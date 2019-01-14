import api from '../../modules/api';
import {
  FETCH_EVENTS_BEGIN,
  FETCH_EVENTS_SUCCESS,
  FETCH_EVENTS_FAILURE,
  FETCH_EVENT_BEGIN,
  FETCH_EVENT_FAILURE,
  FETCH_EVENT_SUCCESS,
} from './const';

export const fetchAll = () => (dispatch) => {
  dispatch({
    type: FETCH_EVENTS_BEGIN,
  });

  api.get('/events')
    .then((events) => {
      dispatch({
        payload: events,
        type: FETCH_EVENTS_SUCCESS,
      });
    })
    .catch((err) => {
      dispatch({
        payload: err,
        type: FETCH_EVENTS_FAILURE,
      });
    });
};

export const fetch = ({ id }) => (dispatch) => {
  dispatch({
    payload: id,
    type: FETCH_EVENT_BEGIN,
  });

  api.get(`/events/${id}`)
    .then((venue) => {
      dispatch({
        payload: venue,
        type: FETCH_EVENT_SUCCESS,
      });
    })
    .catch((err) => {
      dispatch({
        payload: err,
        type: FETCH_EVENT_FAILURE,
      });
    });
};
