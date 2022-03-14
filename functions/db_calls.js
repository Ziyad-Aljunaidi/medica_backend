
 //Initialize Cloud Firestore through Firebase
//import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";
//const firebaseApp = initializeApp({
//  apiKey: "AIzaSyD18CvQu6AWzU9CFu_75aL92nOThgeZd6A",
//  authDomain: "medica72-5933c.firebaseapp.com",
//  projectId: "medica72-5933c",
//});
//import { collection, getDocs } from "firebase/firestore";

const fbInitApp = require("firebase/app")
const getFr = require("firebase/firestore")

const firebaseApp = fbInitApp.initializeApp({
  apiKey: "AIzaSyD18CvQu6AWzU9CFu_75aL92nOThgeZd6A",
  authDomain: "medica72-5933c.firebaseapp.com",
  projectId: "medica72-5933c",
});



const db = getFr.getFirestore();

//import res from "express/lib/response";

async function queryDoctor(doctorId) {
  let resultData = "tezk 7mra";
  const queryDoc = await  getFr.getDocs(getFr.collection(db, "doctors"));

  queryDoc.forEach((doc) => {
    if (doc.data()["id"] == doctorId) {
      resultData = doc.data();
    }
  });
  return resultData;
}


async function queryUser(userId) {
  let resultData = "tezk 7mra";
  const query_user = await getFr.getDocs(getFr.collection(db, "users"));

  query_user.forEach((doc) => {
    if (doc.data()["id"] == userId) {
      resultData = doc.data();
    }
  });

  return resultData;
}


// testing queryDoctor Function
//queryDoctor("17000").then((result) => {
//console.log(result);
//});

// testing queryUSer Function
//queryUser("18021").then((result) => {
//console.log(result);
//});

//module.exports= {
//  queryDoctor,
//  queryUser
//}
// export { queryDoctor, queryUser};

module.exports= {
  queryDoctor,
  queryUser
}