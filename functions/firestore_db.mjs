// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { collection, addDoc } from "firebase/firestore"; 
//const fs = require('fs');
import * as fs from 'fs';

const doctors_db = fs.readdirSync('./new_final_data_json')
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyD18CvQu6AWzU9CFu_75aL92nOThgeZd6A',
  authDomain: 'medica72-5933c.firebaseapp.com',
  projectId: 'medica72-5933c'
});

const db = getFirestore();

console.log(doctors_db)

/*
function ExportDocsData(cityname){
  let doctorJson = GetDocsInCity(cityname);
  let docList = [];
  let doctorJsonLength = Object.keys(doctorJson.doctors).length;

  for(let i = 0; i<doctorJsonLength; i++){

      let doc_obj = doctorJson.doctors[i];
      
      let final_doc_obj = 
      {
          "name": doc_obj.name,
          "id": doc_obj.id,
          "clinic": doc_obj.clinic,
          "address1": doc_obj.address1,
          "address2": doc_obj.address2,
          "address": doc_obj.address,
          "city": cityname,
          "phone": doc_obj.phone,
          "gender": doc_obj.gender,
          "google-map": doc_obj["google-map"],
          "qualification": doc_obj.qualification,
          "speciality": doc_obj.speciality,
          "url": doc_obj.url
          
      }

      docList.push(final_doc_obj)
  }
  return docList;
}
*/


try {
  const docRef = await addDoc(collection(db, "users"), {
    first: "Tez",
    last: "ziad",
    born: 1969
  });
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
