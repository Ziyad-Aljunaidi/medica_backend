//Initialize Cloud Firestore through Firebase
//import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";
//const firebaseApp = initializeApp({
//  apiKey: "AIzaSyD18CvQu6AWzU9CFu_75aL92nOThgeZd6A",
//  authDomain: "medica72-5933c.firebaseapp.com",
//  projectId: "medica72-5933c",
//});
//import { collection, getDocs } from "firebase/firestore";
const schedule = require("node-schedule");
const { use } = require("express/lib/application");
const { get } = require("express/lib/request");
const fbInitApp = require("firebase/app");
const getFr = require("firebase/firestore");
const { doc, increment, FieldValue } = require("firebase/firestore");
const Fuse  = require("fuse.js")
const fs = require('fs')

const firebaseApp = fbInitApp.initializeApp({
  apiKey: "AIzaSyD18CvQu6AWzU9CFu_75aL92nOThgeZd6A",
  authDomain: "medica72-5933c.firebaseapp.com",
  projectId: "medica72-5933c",
});

const db = getFr.getFirestore();

function formateDate(date) {
  let dateObj = date;
  let month = dateObj.getUTCMonth() + 1; //months from 1-12
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();
  let hour = dateObj.getHours();
  let mintues = dateObj.getMinutes();

  let formated_date = month + "/" + day + "/" + year;
  let time = hour + ":" + mintues;
  return formated_date;
}

async function queryDoctor(doctorId) {
  let resultData = "default data tests";
  const queryDoc = await getFr.getDocs(getFr.collection(db, "doctors"));

  queryDoc.forEach((doc) => {
    if (doc.data()["id"] == doctorId) {
      resultData = doc.data();
    }
  });
  return resultData;
}

//queryDoctor('17005').then((result) => {
//  console.log(JSON.stringify(result, null, 2))
//})
// async function loop_docs_rating(doc){
//   // let doc_id_list = []
//
//   const queryDoc = await getFr.getDocs(getFr.collection(db, "doctors"));
//   queryDoc.forEach((doc) => {
//     //doc_id_list.push(doc.data().id)
//     setRatings(doc.data().id, "18007", "3")
//     console.log(doc.data().id)
//   })
//
// }
// loop_docs_rating("aa")


async function getSearchDoctor(searchQuery){
  const query_doctor = await getFr.getDocs(getFr.collection(db, "doctors"));
  let doctor_list = []

  query_doctor.forEach((doc) =>{
    doctor_list.push(doc.data())
  })
  //console.log(doctor_list)

  const fuse = new Fuse(doctor_list, {
    keys: ['name', 'category']
  })

  let data = fuse.search(searchQuery)
  let finalData = []
  if(data.length != 0){
    
    data.forEach((item) =>{
      //console.log(item.item)
      finalData.push(item.item)
    })
  }else{
    finalData = doctor_list
  }


  //console.log(fuse.search(searchQuery))
  //let data = 
  return finalData
}
//getSearchDoctor("mohamed").then((result) =>{
//  console.log(result)
//})

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

async function editUserInfo(usrData){
    let user_data = await getFr.getDocs(getFr.collection(db, "users"));
    //await getFr.deleteDoc(getFr.doc(db, "users", "18018"))
    let data = {message:"haha IDIOT"}
    user_data.forEach(async(doc) =>{
      if(doc.data().id == usrData.id){
          console.log(doc.id, " => ", doc.data())
          await getFr.deleteDoc(getFr.doc(db, "users", doc.id));
          await AddUsersData(usrData)
      }
    })
    return usrData;
    //console.log(JSON.stringify(userData, 0, 2))
}
// let heapData = {
// date_of_birth: "2022-06-23",
// email: "zadj99965@gmail.com",
// first_name: "Ziyadonoga",
// gender: "f",
// id: "18017",
// last_name: "Aljunaidi",
// national_id: "12345678901234",
// password: "cygaMaw",
// phone_number: "01113357439",
// }
// editUserInfo(heapData).then((result) =>{
//  console.log(result)
// })
//queryUser("18019").then((result) =>{
//  console.log(result)
//})
async function querySpeciality(docSpeciality) {
  const query_user = await getFr.getDocs(getFr.collection(db, "doctors"));
  let resultData = [];
  query_user.forEach((doc) => {
    if (doc.data()["category"] == docSpeciality) {
      resultData.push(doc.data());
    }
  });
  return resultData;
}

async function getAppointments(doc_id) {
  const docRef = getFr.doc(db, "appointments", doc_id);
  const docSnap = await getFr.getDoc(docRef);

  if (docSnap.exists()) {
    //console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return 0
  }
}
// getAppointments("17029").then((result) => {
//   console.log(result)
// })

async function setAppointments(
  doc_id,
  user_id,
  visit_id,
  user_time,
  date_stamp,
  status_code,
  reason_code,
  fees,
  clinic_code
) {
  let patients_obj = {
    user_id: user_id,
    user_time: user_time,
    visit_id:visit_id,
    status_code: status_code,
    date_stamp: date_stamp,
    reason_code: reason_code,
    prescription: "none",
    fees: fees,
    clinic: clinic_code,
  };

  try {
    await getFr.updateDoc(getFr.doc(db, "appointments", doc_id), {
      patients: getFr.arrayUnion(patients_obj),
    });
  } catch (err) {
    console.log(err);
    await getFr.setDoc(getFr.doc(db, "appointments", doc_id), {
      patients: getFr.arrayUnion(patients_obj),
    });
  }
  setUserAppointments(
    user_id,
    doc_id,
    visit_id,
    user_time,
    date_stamp,
    status_code,
    reason_code,
    fees,
    clinic_code
  );
}
//setAppointments("17005", "1648335081834", Date.now().toString(),"1000","06/29/2022","1", "2", "300", "1");

async function appointmentsToHistory(doc_id) {
  const docRef = getFr.doc(db, "appointments", doc_id);
  const docSnap = await getFr.getDoc(docRef);
  let documentData = docSnap.data().patients;

  for(let i = 0; i<documentData.length; i++){
    //console.log(documentData[i].status_code)
    if(documentData[i].status_code == '1' || documentData[i].status_code == '2'){
      documentData[i].status_code = '5'
    }
    //documentData[i].date_stamp = "06/24/2022"
    //console.log(documentData[i])
    try {
      await getFr.updateDoc(getFr.doc(db, "history_appointments", doc_id), {
        history: getFr.arrayUnion(documentData[i]),
      });
    } catch (err) {
      //console.log(err);
      await getFr.setDoc(getFr.doc(db, "history_appointments", doc_id), {
        history: getFr.arrayUnion(documentData[i]),
      });
    }
  }
  
  let day_date = Date.now();
  let patients_list = {
    patients: documentData,
  };

  console.log(documentData);
  await getFr.deleteDoc(getFr.doc(db, "appointments", doc_id));
  setAppointments("0000", "0000", Date.now().toString(),"00","6/24/1999","1", "2", "690", "1");
  
}
//appointmentsToHistory("17017");


function getDateAmerican(date){
  let day;  
  if(date.getDate().length >1){
    day = date.getDate()
  }else{
    day = "0"+date.getDate()
  }

  let month;
  if( (date.getMonth()+1).length >1){
    month = (date.getMonth()+1)
  }else{
    month = "0"+(date.getMonth()+1)
  }
  let year =date.getFullYear()
  
  let final_date = month+"/"+day+"/"+year
  return final_date
}
async function historyAppointments(doc_id){
  var today = new Date();
  //let date = getDateAmerican(today)
  date = "06/30/2022"
  //console.log(date)
  const docRef = getFr.doc(db, "appointments", doc_id);
  const docSnap = await getFr.getDoc(docRef);

  let history_list=docSnap.data().patients
  
  history_list.forEach(async(appointment)=>{
    if(appointment.date_stamp == date){
      console.log(appointment)
      await getFr.updateDoc(getFr.doc(db, "appointments", doc_id), {
        patients: getFr.arrayRemove()
      });
    }
  })


  

}
//historyAppointments('181656467565756')

async function getRatingToPatient(user_id) {
  const docRef = getFr.doc(db, "ratingToPatient", user_id);
  const docSnap = await getFr.getDoc(docRef);
  //console.log(docSnap.data())
  return docSnap.data();
}
//getRatingToPatient("18002")

async function setRatingToPatient(doc_id, user_id, doc_rate) {
  let doc_rating_obj = {
    doctor_id: doc_id,
    doctor_rating: doc_rate,
  };

  // Check if the doctor rated this user previously
  try {
    await getRatingToPatient(user_id).then(async (result) => {
      console.log(result);

      for (let i = 0; i < result.ratings.length; i++) {
        if (result.ratings[i].doctor_id == doc_id) {
          console.log(result.ratings[i].doctor_id);
          await getFr.updateDoc(getFr.doc(db, "ratingToPatient", user_id), {
            ratings: getFr.arrayRemove(result.ratings[i]),
          });
        }
      }
    });
  } catch (err) {
    console.log("New Rating..");
  }

  try {
    await getFr.updateDoc(getFr.doc(db, "ratingToPatient", user_id), {
      ratings: getFr.arrayUnion(doc_rating_obj),
      //ratings: getFr.arrayRemove({user_id: "18006",user_rating:"5"}),
    });
    console.log("Already Present");
  } catch (err) {
    console.log(err);
    await getFr.setDoc(getFr.doc(db, "ratingToPatient", user_id), {
      ratings: getFr.arrayUnion(doc_rating_obj),
    });
    console.log("New..");
    console.log(err);
  }
}
//setRatingToPatient("17001", "18006", "9");

async function getRatings(doc_id) {
  const docRef = getFr.doc(db, "ratings", doc_id);
  const docSnap = await getFr.getDoc(docRef);
  // console.log(docSnap.data())
  //query.forEach((doc) => {
  //  //console.log("hah")
  //  console.log(doc);
  //});
  return docSnap.data();
}
//getRatings("17002")

async function setRatings(doc_id, user_id, user_rate) {
  let user_rating_obj = {
    user_id: user_id,
    user_rating: user_rate,
  };

  // Check if the user rated this doctor previously
  try {
    await getRatings(doc_id).then(async (result) => {
      console.log(result);
      for (let i = 0; i < result.ratings.length; i++) {
        if (result.ratings[i].user_id == user_id) {
          console.log(result.ratings[i].user_id);
          await getFr.updateDoc(getFr.doc(db, "ratings", doc_id), {
            ratings: getFr.arrayRemove(result.ratings[i]),
          });
        }
      }
    });
  } catch (err) {
    console.log("New Rating...");
  }

  try {
    await getFr.updateDoc(getFr.doc(db, "ratings", doc_id), {
      ratings: getFr.arrayUnion(user_rating_obj),
      //ratings: getFr.arrayRemove({user_id: "18006",user_rating:"5"}),
    });
    console.log("Already Present");
  } catch (err) {
    console.log(err);
    await getFr.setDoc(getFr.doc(db, "ratings", doc_id), {
      ratings: getFr.arrayUnion(user_rating_obj),
    });
    console.log("New..");
    console.log(err);
  }
}
// setRatings("17001", "18006", "5");

async function getReviews(doc_id) {
  const docRef = getFr.doc(db, "reviews", doc_id);
  const docSnap = await getFr.getDoc(docRef);
  console.log(docSnap.data());
  return docSnap.data();
}
// getReviews("17002")

async function setReviews(doc_id, user_id, user_review, user_rating, visit_id, date_stamp, user_name) {
  user_review_obj = {
    user_name:user_name,
    user_id: user_id,
    user_review: user_review,
    user_rating: user_rating,
    visit_id: visit_id,
    date_stamp: date_stamp
  };
  try {
    await getFr.updateDoc(getFr.doc(db, "reviews", doc_id), {
      reviews: getFr.arrayUnion(user_review_obj),
    });
  } catch (err) {
    //console.log(err);
    await getFr.setDoc(getFr.doc(db, "reviews", doc_id), {
      reviews: getFr.arrayUnion(user_review_obj),
    });
  }
}
//setReviews("17005","18001","man this doc is the best", "4", "1234", "5678")

// GETING Doctor ID in appointments
async function getDocIdApp() {
  const query_user = await getFr.getDocs(getFr.collection(db, "appointments"));
  query_user.forEach((doc) => {
    //console.log(doc.id)
    appointmentsToHistory(doc.id);
  });
}
//getDocIdApp();

async function readHistory(doc_id) {
  const docRef = getFr.doc(db, "history_appointments", doc_id);
  const docSnap = await getFr.getDoc(docRef);
  let documentData = docSnap.data().history;
  //console.log(JSON.stringify(documentData))
  return documentData;
}
//readHistory("17002")

async function AddUsersData(users_db) {
  try {
    const docRef = await getFr.addDoc(getFr.collection(db, "users"), users_db);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function SignIn(user_data) {
  const query_user = await getFr.getDocs(getFr.collection(db, "users"));
  let resultData = [];
  query_user.forEach((doc) => {
    if (
      doc.data()["email"] == user_data.email &&
      doc.data()["password"] == user_data.password
    ) {
      if(doc.data()["flags"] >= 3){
        resultData ={message:"suspended account"}
      }else{
        resultData.push(doc.data());
        
      }
    }
  });
  return resultData;
  
}

async function AddDoctorsData(doctors_db) {
  try {
    const docRef = await getFr.addDoc(
      getFr.collection(db, "doctors"),
      doctors_db
    );
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function DocSignIn(doc_data) {
  const query_user = await getFr.getDocs(getFr.collection(db, "doctors"));
  let resultData = [];
  query_user.forEach((doc) => {
    if (
      doc.data()["email"] == doc_data.email &&
      doc.data()["password"] == doc_data.password
    ) {
      if(doc.data()["flags"] >= 1){
        resultData ={message:"suspended account"}
      }else{
        resultData.push(doc.data());
        
      }
    }
  });
  return resultData;
}
//  DocSignIn({email:"hon3bl@gmail.com",password:"ggez69"}).then((result) => {
//    console.log(result)
//  })


//Responsible for doctor appointments DOCUMENT updates.
async function statusAppointment(
  doc_id,
  user_id,
  visit_id,
  user_time,
  status_code,
  date_stamp,
  reason_code,
  fees,
  prescription,
  clinic_code
) {
  try {
    await getAppointments(doc_id).then((result) => {
      for (let i = 0; i < result.patients.length; i++) {
        if (result.patients[i].visit_id === visit_id) {
          console.log("updating array in doctor appointments..]");
          getFr.updateDoc(getFr.doc(db, "appointments", doc_id), {
            patients: getFr.arrayRemove(result.patients[i]),
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
  }

  let patients_obj = {
    user_id: user_id,
    visit_id:visit_id,
    user_time: user_time,
    status_code: status_code,
    date_stamp: date_stamp,
    reason_code: reason_code,
    prescription: prescription,
    fees: fees,
    clinic: clinic_code,
  };
  try {
    await getFr.updateDoc(getFr.doc(db, "appointments", doc_id), {
      patients: getFr.arrayUnion(patients_obj),
    });
  } catch (err) {
    console.log(err);
    await getFr.setDoc(getFr.doc(db, "appointments", doc_id), {
      patients: getFr.arrayUnion(patients_obj),
    });
  }

  statusUserAppointments( doc_id, user_id,visit_id, user_time,status_code, date_stamp, reason_code,fees, prescription,clinic_code)
}

// Responsible for setting an appointment in userAppointments DOCUMENT
async function setUserAppointments(
  user_id,
  doc_id,
  visit_id,
  user_time,
  date_stamp,
  status_code,
  reason_code,
  fees,
  clinic_code
) {
  let doc_specaility;
  let doc_name;
  let rate_code;

  await queryDoctor(doc_id).then((result) => {
    doc_specaility = result.category;
    doc_name = result.name;
  });
  let patients_obj = {
    doc_id:doc_id,
    user_id: user_id,
    visit_id: visit_id,
    user_time: user_time,
    status_code: status_code,
    date_stamp: date_stamp,
    reason_code: reason_code,
    prescription: "none",
    fees: fees,
    clinic: clinic_code,
    rate_code: '0',
    rating: "none",
    speciality: doc_specaility,
    name: doc_name,
  };

  console.log(patients_obj);
  try {
    await getFr.updateDoc(getFr.doc(db, "userAppointments", user_id), {
      appointments: getFr.arrayUnion(patients_obj),
    });
  } catch (err) {
    console.log(err);
    await getFr.setDoc(getFr.doc(db, "userAppointments", user_id), {
      appointments: getFr.arrayUnion(patients_obj),
    });
  }
}

// Gets all the User Appointments
async function getUserAppointments(user_id) {
  const docRef = getFr.doc(db, "userAppointments", user_id);
  const docSnap = await getFr.getDoc(docRef);

  if (docSnap.exists()) {
    //console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}


//Responsible for the User Appointments updates
async function statusUserAppointments(
  doc_id,
  user_id,
  visit_id,
  user_time,
  status_code,
  date_stamp,
  reason_code,
  fees,
  prescription,
  clinic_code
) {

  let rating;
  let rate_code;
  let doc_name;
  let doc_specaility;
  try {
    await getUserAppointments(user_id).then((result) => {
      
      
      for (let i = 0; i < result.appointments.length; i++) {
        console.log("RESULTS =>")
        console.log(result.appointments[i])
        if (result.appointments[i].visit_id == visit_id) {
          console.log("found it MANGA")
          console.log("updating array.. in user appointments]");
          if(status_code == '3'){
            rate_code = "1"
          }else{
            rate_code = result.appointments[i].rate_code
          }
          
          rating = result.appointments[i].rating
          doc_name = result.appointments[i].name
          doc_specaility = result.appointments[i].speciality
          getFr.updateDoc(getFr.doc(db, "userAppointments", user_id), {
            appointments: getFr.arrayRemove(result.appointments[i]),
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
    console.log("GOT WRICKED M8")
  }

  let patients_obj = {
    doc_id:doc_id,
    user_id: user_id,
    visit_id:visit_id,
    user_time: user_time,
    status_code: status_code,
    date_stamp: date_stamp,
    reason_code: reason_code,
    prescription: prescription,
    fees: fees,
    clinic: clinic_code,
    rating: rating,
    rate_code: rate_code,
    name: doc_name,
    speciality: doc_specaility
  };
  console.log(patients_obj)
  try {
    await getFr.updateDoc(getFr.doc(db, "userAppointments", user_id), {
      appointments: getFr.arrayUnion(patients_obj),
    });
  } catch (err) {
    console.log(err);
    await getFr.setDoc(getFr.doc(db, "userAppointments", user_id), {
      appointments: getFr.arrayUnion(patients_obj),
    });
  }
}
//statusUserAppointments("17005","18002", "1655245569430",'516',"59", "5/25/2015", "1", "23", "none", "5")
//setUserAppointments("1648335081834","17005",'122334342432',"669","1","06/29/2022", "1","0","340","0")
//statusAppointment("17005","18002", "1655246289485",'516',"1", "6/25/2022", "2", "255", "none", "5")
//setAppointments("17009", "1648335081834", Date.now().toString(),"430","06/30/2022","1", "2", "300", "1");


// FUNCTION FOR DELETION
async function delDocument(keyword, id){
  if (keyword == "doctors"){
    await getFr.deleteDoc(getFr.doc(db, "doctors", id));
    return `${id} is deleted.`
  }else if (keyword == "users"){
    await getFr.deleteDoc(getFr.doc(db, "doctors", id));
    return `${id} is deleted.`
  }else{
    return 0
  }
}

async function getAllData(keyword){
  let alldata = []
  const data = await getFr.getDocs(getFr.collection(db, keyword));

  data.forEach((document) =>{
    console.log(document.data())
    alldata.push(document.data())
  })
  return alldata
}
//getAllData("users")


async function incUserFlags(user_id){
  const data = await getFr.getDocs(getFr.collection(db, "users"));
  data.forEach(async (document) =>{
    if(document.data()["id"] == user_id){
    console.log(document.id)
    const user_db = doc(db, "users", document.id);
    
    await getFr.updateDoc(user_db, {
          flags: increment(1)
      });
    }
  })
}

async function susUserFlags(user_id){
  const data = await getFr.getDocs(getFr.collection(db, "users"));
  data.forEach(async (document) =>{
    if(document.data()["id"] == user_id){
    console.log(document.id)
    const user_db = doc(db, "users", document.id);
    
    await getFr.updateDoc(user_db, {
          flags: 3
      });
    }
  })
}

async function resetFlags(user_id){
  const data = await getFr.getDocs(getFr.collection(db, "users"));
  data.forEach(async (document) =>{
    if(document.data()["id"] == user_id){
    console.log(document.id)
    const user_db = doc(db, "users", document.id);
    
    await getFr.updateDoc(user_db, {
          flags: 0
      });
    }
  })
}

async function suspendDocFlags(doc_id){
  const data = await getFr.getDocs(getFr.collection(db, "doctors"));
  data.forEach(async (document) =>{
    if(document.data()["id"] == doc_id){
    console.log(document.id)
    const user_db = doc(db, "doctors", document.id);
    
    await getFr.updateDoc(user_db, {
          flags: increment(1)
      });
    }
  })
}

async function resetDocFlags(doc_id){
  const data = await getFr.getDocs(getFr.collection(db, "doctors"));
  data.forEach(async (document) =>{
    if(document.data()["id"] == doc_id){
    console.log(document.id)
    const user_db = doc(db, "doctors", document.id);
    
    await getFr.updateDoc(user_db, {
          flags: 0
      });
    }
  })
}
//resetDocFlags('181656518647438')

// Atomically increment the population of the city by 50.
 //await getFr.updateDoc(washingtonRef, {
 //    flags: 0
 //});


module.exports = {
  queryDoctor,
  queryUser,
  querySpeciality,
  AddUsersData,
  SignIn,
  getAppointments,
  setAppointments,
  appointmentsToHistory,
  readHistory,
  getDocIdApp,
  getRatings, // doc_id
  setRatings, // doc_id user_id user_rating
  getReviews, // doc_id
  setReviews, // doc_id user_id user_review
  statusAppointment,
  DocSignIn,
  AddDoctorsData,
  editUserInfo,
  getUserAppointments,
  getSearchDoctor,
  getAllData,
  incUserFlags,
  susUserFlags,
  resetFlags,
  suspendDocFlags,
  resetDocFlags
};
