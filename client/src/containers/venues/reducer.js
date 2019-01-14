import {
  FETCH_VENUES_BEGIN,
  FETCH_VENUES_SUCCESS,
  FETCH_VENUES_FAILURE,
  FETCH_VENUE_BEGIN,
  FETCH_VENUE_FAILURE,
  FETCH_VENUE_SUCCESS,
} from './const';

const initialState = {
  data: [],
  error: null,
  isLoading: false,
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case FETCH_VENUES_BEGIN:
    case FETCH_VENUE_BEGIN:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_VENUES_SUCCESS:
    case FETCH_VENUE_SUCCESS:
      return {
        ...state,
        data: payload,
        error: null,
        isLoading: false,
      };

    case FETCH_VENUES_FAILURE:
    case FETCH_VENUE_FAILURE:
      return {
        ...state,
        data: [],
        error: payload,
        isLoading: false,
      };

    default:
      return state;
  }
};
