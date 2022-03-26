import { doc, getFirestore, setDoc, Timestamp } from "firebase/firestore"; 

import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyD18CvQu6AWzU9CFu_75aL92nOThgeZd6A",
    authDomain: "medica72-5933c.firebaseapp.com",
    projectId: "medica72-5933c",
  });

const db = getFirestore();

/*
const docData = {
    stringExample: "Hello world!",
    booleanExample: true,
    numberExample: 3.14159265,
    dateExample: Timestamp.fromDate(new Date("December 10, 1815")),
    arrayExample: [5, true, "hello"],
    nullExample: null,
    objectExample: {
        a: 5,
        b: {
            nested: "foo"
        }
    }
};
await setDoc(doc(db, "data"), docData);
*/

// Add a new document with a generated id.
const res = await db.collection('data').add({
    name: 'Tokyo',
    country: 'Japan'
  });
  
  console.log('Added document with ID: ', res.id);