import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyCKEcyR-Zk8ygv1oF_0E9L0vuLRO9kv2qc',
  authDomain: 'hiden-no-tare.firebaseapp.com',
  databaseURL: 'https://hiden-no-tare.firebaseio.com',
  projectId: 'hiden-no-tare',
  storageBucket: 'hiden-no-tare.appspot.com',
  messagingSenderId: '656427067087',
  appId: '1:656427067087:web:1bb2e46ba8ce48141a79ba',
  measurementId: 'G-7YEQNDQGXX',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
