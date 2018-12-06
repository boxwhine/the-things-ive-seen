import firebase from './firebase';

export const EVENTS_COLLECTION = 'events';
export const VENUES_COLLECTION = 'venues';

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

const mapCollection = coll => coll.docs.map(doc => ({
  id: doc.id,
  ...doc.data(),
}));

const errorHandler = (err) => {
  throw err;
};

export const fetchEvents = () => db.collection(EVENTS_COLLECTION).get()
  .then(mapCollection)
  .catch(errorHandler);

export const fetchEvent = (id) => {
  return db.collection(EVENTS_COLLECTION).get()
    .then(coll => coll.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })))
    .catch(errorHandler);
};

export const fetchVenues = () => db.collection(VENUES_COLLECTION).get()
  .then(mapCollection)
  .catch(errorHandler);
