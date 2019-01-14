import api from '../../modules/api';
import {
  FETCH_VENUES_BEGIN,
  FETCH_VENUES_SUCCESS,
  FETCH_VENUES_FAILURE,
  FETCH_VENUE_BEGIN,
  FETCH_VENUE_SUCCESS,
  FETCH_VENUE_FAILURE,
} from './const';

export const fetchAll = () => (dispatch) => {
  dispatch({
    type: FETCH_VENUES_BEGIN,
  });

  api.get('/venues')
    .then((venues) => {
      dispatch({
        payload: venues,
        type: FETCH_VENUES_SUCCESS,
      });
    })
    .catch((err) => {
      dispatch({
        payload: err,
        type: FETCH_VENUES_FAILURE,
      });
    });
};

export const fetch = ({ id }) => (dispatch) => {
  dispatch({
    payload: id,
    type: FETCH_VENUE_BEGIN,
  });

  api.get(`/venues/${id}`)
    .then((venue) => {
      dispatch({
        payload: venue,
        type: FETCH_VENUE_SUCCESS,
      });
    })
    .catch((err) => {
      dispatch({
        payload: err,
        type: FETCH_VENUE_FAILURE,
      });
    });
};
