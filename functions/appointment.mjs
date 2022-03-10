import * as fs from "fs";

// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseApp = initializeApp({
  apiKey: "AIzaSyD18CvQu6AWzU9CFu_75aL92nOThgeZd6A",
  authDomain: "medica72-5933c.firebaseapp.com",
  projectId: "medica72-5933c",
});

const db = getFirestore();

import { collection, getDocs } from "firebase/firestore";
//import res from "express/lib/response";

async function queryDoctor(doctorId) {
  let tatadata = "tezk 7mra";
  const queryDoc = await getDocs(collection(db, "doctors"));
  queryDoc.forEach((doc) => {
    if (doc.data()["id"] == doctorId) {
      tatadata = JSON.stringify(tatadata, null, 2)
      //console.log(`${doc.id} => ${tatadata}`);
      return tatadata
      // return currentData;
    }else{
      tatadata = "tezy 7mra"
      return tatadata
    }
    

  });
  
}

queryDoctor("18001").then((result) => {
  console.log(result)
})

// const queryDoctor = await getDocs(collection(db, "doctors"));
// queryDoctor.forEach((doc) => {
//   if( doc.data()["id"] == usrId){
//     console.log(`${doc.id} => ${JSON.stringify(doc.data(),null,2)}`);
//   }

// console.log(doc.data());
//});

// let userId = 19003;
// let doctorId;

/*
const queryUser = await getDocs(collection(db, "users", ));
queryUser.forEach((doc) => {
  if( doc.data()["id"] == usrId){
    console.log(`${doc.id} => ${JSON.stringify(doc.data(),null,2)}`);
  }
  
  // console.log(doc.data());
});
*/
