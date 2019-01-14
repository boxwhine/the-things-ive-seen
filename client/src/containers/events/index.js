import React from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as eventActions from './actions';

class Events extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //    email: “”,
  //    fullname: “”
  //   };
  // }

  componentDidMount() {
    const { fetchAll } = this.props;
    fetchAll();
  }

  render() {
    const {
      // error,
      events,
      isLoading,
    } = this.props;

    return (
      <section>
        <h1>Events</h1>

        {isLoading
          ? <CircularProgress size={50} />
          : (
            <ul>
              {events.map(({
                date: { seconds },
                face_value,
                festival_name,
                genre,
                name,
                sub_genre,
                venue_city,
                venue_country,
                venue_name,
                venue_state,
                was_opener,
              }, idx) => (
                <li key={idx}>{name} ({venue_name})</li>
              ))}
            </ul>
          )
        }
      </section>
    );
  }
}

const mapStateToProps = ({ events: { data, error, isLoading } }) => ({
  error,
  events: data,
  isLoading,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...eventActions,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Events);
