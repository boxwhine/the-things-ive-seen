import React, { useState } from 'react';
import MuiSearchBar, { SearchBarProps } from 'material-ui-search-bar';
import Script from 'react-load-script';

const GOOGLE_API_URL = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;

interface WithId {
  id: String;
};

const SearchBar: React.SFC<SearchBarProps | WithId> = (props) => (
  <MuiSearchBar {...props} />
);

export default ({ onVenueSelect }) => {
  const [query, setQuery] = useState('');

  let autocompleteWidget: google.maps.places.Autocomplete;

  const handlePlaceSelect = () => {
    const addressObject = autocompleteWidget.getPlace();
    onVenueSelect(addressObject);
    setQuery(`${addressObject.name}, ${addressObject.formatted_address}`);
  };

  const handleScriptLoad = () => {
    autocompleteWidget = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete') as HTMLInputElement,
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
      <Script onLoad={handleScriptLoad} url={GOOGLE_API_URL} />
      <SearchBar
        id="autocomplete"
        onChange={setQuery}
        onRequestSearch={() => console.log('on req search', query)}
        placeholder="Find a venue..."
        value={query}
      />
    </div>
  );
};
