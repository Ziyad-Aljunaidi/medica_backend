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

//console.log(doctors_db)

// Function to get all the doctors in specific city
function GetDocsInCity(cityName)
{
    //cityName = cityName.toLowerCase();

    let doctorFile = fs.readFileSync(`./new_final_data_json/${cityName}`)
    let doctorJson = JSON.parse(doctorFile);
    let doctorJsonLength = Object.keys(doctorJson).length;

    return doctorJson ;
}


async function ExportDocsData(cityname){
  let doctorJson = GetDocsInCity(cityname);
  let docList = [];
  let doctorJsonLength = Object.keys(doctorJson).length;

  for(let i = 0; i<doctorJsonLength; i++){

      let doc_obj = doctorJson[i];
      
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
          "google_map": doc_obj["google_map"],
          "qualification": doc_obj.qualification,
          "speciality": doc_obj.speciality,
          "url": doc_obj.url
          
      }

      docList.push(final_doc_obj)
      try {
        const docRef = await addDoc(collection(db, "doctors"), final_doc_obj);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  }

  return docList;
}

ExportDocsData(doctors_db[0])
// console.log(ExportDocsData(doctors_db[0]))

for(let i=0; i<(doctors_db).length; i++){
  //console.log(i)
  //console.log(ExportDocsData(doctors_db[i]))
  ExportDocsData(doctors_db[i])
}

/*
try {
  const docRef = await addDoc(collection(db, "users"), ExportDocsData(doctors_db[0]));
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
*/
