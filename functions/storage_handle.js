//import { getStorage, ref } from "firebase/storage";
const { getStorage } = require ("firebase/storage");
const { ref } = require ("firebase/storage");
const { initializeApp } = require("firebase/app")
const { uploadBytes } = require("firebase/storage")

const fs = require('fs')

console.log(fs.readFileSync('images/ss.jpg'))
// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
    apiKey: "AIzaSyD18CvQu6AWzU9CFu_75aL92nOThgeZd6A",
    authDomain: "medica72-5933c.firebaseapp.com",
    projectId: "medica72-5933c",
    storageBucket: "medica72-5933c.appspot.com",
    messagingSenderId: "814793286058",
    appId: "1:814793286058:web:b5be2e4e256510d27b0bd3",
    measurementId: "G-210D30MJ18"
  };
  const firebaseApp = initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage(firebaseApp);

  const storageRef = ref(storage);

  // Create a child reference
const imagesRef = ref(storage, 'ss.jpg');
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
const spaceRef = ref(storage, 'images/ss.jpg');
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"\

file = fs.readFileSync('images/test.png')
// 'file' comes from the Blob or File API
uploadBytes(spaceRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
