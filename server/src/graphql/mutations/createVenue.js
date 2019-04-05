const createVenue = async (parent, { input }, { models }) => {
  const { name, placeId } = input;
  const existingVenue = await models.Venue.findOne({ placeId });

  if (existingVenue) {
    throw new Error(
      `"${name}" venue already exists (Google Place ID: ${placeId})`,
    );
  }

  const venue = new models.Venue({ ...input });

  try {
    const newVenue = await venue.save();
    console.log('Saved new venue...', newVenue);
    return newVenue;
  } catch (err) {
    throw new Error('Error creating venue...', err);
  }
};

module.exports = createVenue;
