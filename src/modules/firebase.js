import firebase from 'firebase';

firebase.initializeApp({
  apiKey: 'AIzaSyBa3EtaK4w6S8SsNX9OqSSQ6ROKl9fTFug',
  authDomain: 'the-things-ive-seen.firebaseapp.com',
  databaseURL: 'https://the-things-ive-seen.firebaseio.com',
  messagingSenderId: '825365120723',
  projectId: 'the-things-ive-seen',
  storageBucket: 'the-things-ive-seen.appspot.com',
});

export default firebase;
