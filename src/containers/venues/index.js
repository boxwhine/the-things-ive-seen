import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as venueActions from './actions';

class Venues extends React.Component {
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
      error,
      venues,
      isLoading,
    } = this.props;

    return (
      <section>
        <h1>Venues</h1>

        {isLoading
          ? <CircularProgress size={50} />
          : (
            <ul>
              {venues.map(({
                city,
                country,
                id,
                location,
                name,
                state,
              }, idx) => (
                <li key={idx}>{name} ({city}, {state}, {country})</li>
              ))}
            </ul>
          )
        }
      </section>
    );
  }
}

const mapStateToProps = ({ venues: { data, error, isLoading } }) => ({
  error,
  venues: data,
  isLoading,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...venueActions,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Venues);
