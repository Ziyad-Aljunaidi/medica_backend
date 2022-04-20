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
//setAppointments("17029", "18005", "6:00","1");

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

async function getRatingToPatient(user_id){
  const docRef = getFr.doc(db, "ratingToPatient", user_id);
  const docSnap = await getFr.getDoc(docRef);
  //console.log(docSnap.data())
  return docSnap.data();
}
//getRatingToPatient("18002")

async function setRatingToPatient(doc_id, user_id, doc_rate) {
  let doc_rating_obj = {
    doctor_id: doc_id,
    doctor_rating:doc_rate,
  };

  // Check if the doctor rated this user previously
  try{
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
  }catch(err){
    console.log("New Rating..")
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
setRatingToPatient("17001", "18006", "9");

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
  try{
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
  } catch(err){
    console.log("New Rating...")
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

async function setReviews(doc_id, user_id, user_review) {
  user_review_obj = {
    user_id: user_id,
    user_review: user_review,
  };
  try {
    await getFr.updateDoc(getFr.doc(db, "reviews", doc_id), {
      ratings: getFr.arrayUnion(user_review_obj),
    });
  } catch (err) {
    //console.log(err);
    await getFr.setDoc(getFr.doc(db, "reviews", doc_id), {
      ratings: getFr.arrayUnion(user_review_obj),
    });
  }
}
// setReviews("17002","18001","man this doc is the best")

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
  getRatings, // doc_id
  setRatings, // doc_id user_id user_rating
  getReviews, // doc_id
  setReviews, // doc_id user_id user_review
};
