import {
  FETCH_EVENTS_BEGIN,
  FETCH_EVENTS_SUCCESS,
  FETCH_EVENTS_FAILURE,
  FETCH_EVENT_BEGIN,
  FETCH_EVENT_FAILURE,
  FETCH_EVENT_SUCCESS,
} from './const';

const initialState = {
  data: [],
  error: null,
  isLoading: false,
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case FETCH_EVENTS_BEGIN:
      return {
        ...state,
        isLoading: true,
      };

    case FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        data: payload,
        error: null,
        isLoading: false,
      };

    case FETCH_EVENTS_FAILURE:
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
