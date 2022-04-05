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

const firebaseApp = fbInitApp.initializeApp({
  apiKey: "AIzaSyD18CvQu6AWzU9CFu_75aL92nOThgeZd6A",
  authDomain: "medica72-5933c.firebaseapp.com",
  projectId: "medica72-5933c",
});

const db = getFr.getFirestore();

let dateObj = Date.now();

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
  }
}
// getAppointments("17002").then((result) => {
//   console.log(result)
// })

async function setAppointments(doc_id, user_id, user_time, status_code) {
  let patients_obj = {
    user_id: user_id,
    user_time: user_time,
    status_code: status_code,
    date_stamp: dateObj,
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
}
//setAppointments("17031", "666s66", "6:69","1");

async function appointmentsToHistory(doc_id) {
  const docRef = getFr.doc(db, "appointments", doc_id);
  const docSnap = await getFr.getDoc(docRef);
  let documentData = docSnap.data().patients;

  let day_date = Date.now();
  let patients_list = {
    date: day_date,
    patients: documentData,
  };

  //console.log(patients_list);
  try {
    await getFr.updateDoc(getFr.doc(db, "history_appointments", doc_id), {
      history: getFr.arrayUnion(patients_list),
    });
  } catch (err) {
    //console.log(err);
    await getFr.setDoc(getFr.doc(db, "history_appointments", doc_id), {
      history: getFr.arrayUnion(patients_list),
    });
  } finally {
    await getFr.deleteDoc(getFr.doc(db, "appointments", doc_id));
  }
}
//appointmentsToHistory("17005");

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
      resultData.push(doc.data());
    }
  });
  return resultData;
}

//  SignIn({email:"zadj99965@gmail.com", password: "cygaMaw"}).then((result)=>{
//  console.log(result)
//  })

//AddUsersData({id:"456",name:"test"})

// querySpeciality("pediatrics").then((result) => {
//   console.log(result)
// })

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
};
