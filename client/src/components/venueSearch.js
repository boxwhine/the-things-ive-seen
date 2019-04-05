import React, { useState } from 'react';
import SearchBar from 'material-ui-search-bar';
import Script from 'react-load-script';

const GOOGLE_API_URL = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;

export default ({ onVenueSelect }) => {
  const [query, setQuery] = useState('');

  let autocompleteWidget;

  const handlePlaceSelect = () => {
    const addressObject = autocompleteWidget.getPlace();
    onVenueSelect(addressObject);
    setQuery(`${addressObject.name}, ${addressObject.formatted_address}`);
  };

  const handleScriptLoad = () => {
    /* global google */
    autocompleteWidget = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      {
        componentRestrictions: {
          // Scope search results to USA only
          country: ['us'],
        },
        // For complete list of possible fields, see
        // https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult
        fields: ['address_components', 'formatted_address', 'geometry.location', 'icon', 'name', 'photos', 'place_id'],
        types: ['establishment'],
      },
    );

    // Fire Event when a suggested name is selected
    autocompleteWidget.addListener('place_changed', handlePlaceSelect);
  };

  return (
    <div>
      <Script
        onLoad={handleScriptLoad}
        url={GOOGLE_API_URL}
      />
      <SearchBar
        id="autocomplete"
        placeholder="Search Venues"
        value={query}
      />
    </div>
  );
};
