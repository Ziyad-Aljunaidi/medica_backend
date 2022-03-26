
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

async function querySpeciality(docSpeciality) {
  const query_user = await getFr.getDocs(getFr.collection(db, "doctors"));
  let resultData =[];
  query_user.forEach((doc) => {
    if (doc.data()["category"] == docSpeciality) {
      resultData.push(doc.data());
    }

  });
  return resultData;
}


<<<<<<< HEAD
=======
async function addUser(user_data){
  /*
  const add_user = await getFr.setDoc(getFr.collection(db, "users"));
  try{
    add_user.forEach((doc) => {
      doc.data()["id"] == user_data.id
    })
  }catch(e){
    console.log(e)
  }
 */

  await getFr.setDoc(getFr.doc(db,"users", "one"),user_data)
}

//addUser({id:"52648"})

async function AddUsersData(users_db) {
    try {
      const docRef = await getFr.addDoc(getFr.collection(db, "users"),users_db);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

}


async function SignIn(user_data){
  const query_user = await getFr.getDocs(getFr.collection(db, "users"));
  let resultData =[];
  query_user.forEach((doc) => {
    if (doc.data()["email"] == user_data.email && doc.data()["password"] == user_data.password) {
      resultData.push(doc.data());
    }

  });
  return resultData;
}

//console.log("mawaa")

// SignIn({email:"zadj99965@gmail.com", password: "cygaMaw"}).then((result)=>{
//   console.log(result)
// })

//AddUsersData({id:"456",name:"test"})


>>>>>>> 29eaaa42c350dfc5f2d36911ccdf247091c72fa1
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

module.exports= {
  queryDoctor,
  queryUser,
  querySpeciality,
  AddUsersData,
  SignIn
}