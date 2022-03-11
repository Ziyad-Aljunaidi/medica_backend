// Initialize Cloud Firestore through Firebase
//import { use } from "express/lib/application";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
//const fs = require('fs');
import * as fs from "fs";

const doctors_db = fs.readFileSync("Doctors.json");
const users_db = fs.readFileSync("user.json");
const firebaseApp = initializeApp({
  apiKey: "AIzaSyD18CvQu6AWzU9CFu_75aL92nOThgeZd6A",
  authDomain: "medica72-5933c.firebaseapp.com",
  projectId: "medica72-5933c",
});

const db = getFirestore();

// Function to get all the doctors in specific city
function GetDocsInFile(doctors_db) {
  let doctorJson = JSON.parse(doctors_db);
  let doctorJsonLength = Object.keys(doctorJson).length;

  return doctorJson;
}

async function ExportDocsData(doctors_db) {
  let doctorJson = GetDocsInFile(doctors_db);
  let docList = [];
  let doctorJsonLength = Object.keys(doctorJson).length;

  for (let i = 0; i < doctorJsonLength; i++) {
    let doc_obj = doctorJson[i];

    let final_doc_obj = {
      name: doc_obj.Name.toLowerCase(),
      id: doc_obj.id,
      address: doc_obj.address.toLowerCase(),
      city: doc_obj.city.toLowerCase(),
      google_map: doc_obj.google_map.toLowerCase(),
      speciality: doc_obj.Speciality.toLowerCase(),
      qualification: doc_obj.Qualification.toLowerCase(),
      category: doc_obj.Category.toLowerCase(),
      fee: doc_obj.Fee.toLowerCase(),
    };

    docList.push(final_doc_obj);
    try {
      const docRef = await addDoc(collection(db, "doctors"), final_doc_obj);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return docList;
}

async function ExportUsersData(users_db) {
  let userJson = GetDocsInFile(users_db);
  let userList = [];
  let userJsonLength = Object.keys(userJson).length;

  for (let i = 0; i < userJsonLength; i++) {
    let user_obj = userJson[i];

    let final_user_obj = {
      name: user_obj.name.toLowerCase(),
      id: user_obj.id,
      email: user_obj.email.toLowerCase(),
      phone_number: user_obj.phone_number.toLowerCase(),
    };

    userList.push(final_user_obj);
    try {
      const docRef = await addDoc(collection(db, "users"), final_user_obj);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return userList;
}

// ExportDocsData(doctors_db)

//console.log(ExportUsersData(users_db));
ExportUsersData(users_db)
