const functions = require("firebase-functions");

require('dotenv').config();
const express = require("express");
const db_calls = require("./db_calls.js");
const schedule = require("node-schedule");
const api = express();
var url = require("url");
const database_manipulation = require("./database_manipulation.js")
const send_sms = require("./send_sms.js");
const req = require("express/lib/request");
// using the PORT in the .env file
// const port = process.env.PORT;
const cors=require("cors");
const { get } = require("express/lib/response");
const { query } = require("express");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

api.use(cors(corsOptions)) 

async function searchQuery(urlQuery, data){
  try{
    if(urlQuery.city != undefined && urlQuery.speciality != undefined){
      console.log("city & speciality queries")
      
      data = database_manipulation.findListings("city", urlQuery.city);
      let new_data = await data;

      console.log(new_data[0].speciality)
      data = [];
      
      for(let i = 0; i<new_data.length; i++){
        if(new_data[i].speciality === urlQuery.speciality){
          data.push(new_data[i]);
        }
      }
    }else if(urlQuery.city != undefined){
      console.log(urlQuery.city + " CITY");
      data = database_manipulation.findListings("city", urlQuery.city);
    }else if(urlQuery.speciality != undefined){
      console.log(urlQuery.speciality+" SPECIALITY")
      data =  database_manipulation.findListings("speciality", urlQuery.speciality)      
    }else if(urlQuery.id != undefined){
      console.log(urlQuery.id+" ID")
      data =  database_manipulation.findListings("id", urlQuery.id);
    }
    return data
  }catch(e){
    console.error(e);
  }
}

async function send_comfirmation(doc_id, usr_id){
  let doc_data = await db_calls.queryDoctor(doc_id)
  let user_phonenumber = await db_calls.queryUser(usr_id)
  console.log(doc_data)
  console.log(user_phonenumber)
  send_sms.confirmMsg(doc_data.name, doc_data.address, doc_data.google_map, user_phonenumber.phone_number)
}

async function sendMsg(option,doc_id, user_name, user_phonenumber, user_time,user_date){

  let doc_data = await db_calls.queryDoctor(doc_id)
  console.log(doc_data, user_name , user_phonenumber, user_time)
  //Confirmation message
  if(option == "0"){
    send_sms.confirmMsg(doc_data.name, doc_data.address, doc_data.google_map,user_name, user_phonenumber, user_time,user_date)
    return "confirmation success"
  }else if(option == "1"){
    send_sms.cancelMsg(doc_data.name, user_name, user_phonenumber, user_time)
      return "cancellation success"
  }else{
    return "unidentified option"
  }
  
}


function moveToHistory(){
  schedule.scheduleJob('0 23 * * *', () => {db_calls.getDocIdApp()});
}
moveToHistory()


//db_calls.getDocIdApp()
api.get("/", (req, res) =>{
  res.send("WELCOME TO MEDICA72.COM API")
  console.log("testing route ;)")
});

api.get("/test", (req, res) =>{
  res.end(JSON.stringify({'test':2},null, 2))
  console.log("testing route ;)")
});

api.get("/doctor", (req,res) => {
  let urlQuery = req.query;
  console.log(urlQuery.city, urlQuery.id, urlQuery.speciality)
  if(Object.keys(urlQuery).length != 0){
    searchQuery(urlQuery).then((result) =>{
     // res.json(result);
     res.end(JSON.stringify(result,null, 2))
    });

    
  }else{
    console.log("NO QUERY FOUND! ;(")
  }
});

api.get("/getdoctor", (req,res) =>{
  let queries = req.query;
  db_calls.queryDoctor(queries.doc_id).then((result) => {
    res.json(result)
    console.log(result)
  })
})

api.get("/reserve" , (req,res) => {
  let urlQuery = req.query;
  let doc_id = urlQuery.doc_id;
  let usr_id = urlQuery.usr_id;
  let day = urlQuery.day;
  let time = urlQuery.time
  let doc_data 
  sendConfirmMsg(doc_id, usr_id)
 
  //
})

api.get("/newdoctor", (req, res) => {
  let speciality = req.query.speciality;
  db_calls.querySpeciality(speciality).then((result) => {
    res.json(result)
  })
})

api.get("/send", (req, res) => {
  let queries = req.query
  console.log(queries)
  res.json(queries)
});

api.get("/confirmation", (req, res) => {
  let urlQuery = req.query
  let doc_id = urlQuery.doc_id;
  let user_name = urlQuery.user_name;
  let user_phone = urlQuery.user_phone;
  let user_time = urlQuery.user_time
  let user_date = urlQuery.user_date;
  //res.json({message:`confirmation message sent to ${user_phone}`})
  sendMsg('0',doc_id, user_name, user_phone, user_time, user_date).then((result) =>{
    res.json({message: result})
  })
})

api.get("/cancellation", (req,res)=>{
  let urlQuery = req.query
  let doc_id = urlQuery.doc_id;
  let user_name = urlQuery.user_name;
  let user_phone = urlQuery.user_phone;
  let user_time = urlQuery.user_time
  let user_date = urlQuery.user_date;
  //res.json({message:`confirmation message sent to ${user_phone}`})
  sendMsg('1',doc_id, user_name, user_phone, user_time, user_date).then((result) =>{
    res.json({message: result})
  })
})


api.get("/addUser", (req, res) => {
  let queries = req.query;
  let usr_id = "18"+ Date.now()
  let usr_data = {
    id: usr_id,
    first_name: queries.first_name,
    last_name: queries.last_name,
    gender: queries.gender,
    email: queries.email,
    date_of_birth: queries.date_of_birth,
    password: queries.password,
    phone_number: queries.phone_number,
    national_id: queries.national_id,
    flags: 0
  }
  db_calls.AddUsersData(usr_data).then( res.json(usr_data))
})


api.get("/signin", (req, res) => {
  let queries = req.query;
  let user_data = {
    email: queries.email,
    password: queries.password
  }
  db_calls.SignIn(user_data).then((result) => {
    res.json(result)
    console.log(result)
  })
})

api.get("/doctor_signin", (req,res) =>{
  let queries = req.query;
  let doctor_data = {
    email: queries.email,
    password: queries.password,
  }
  db_calls.DocSignIn(doctor_data).then((result) => {
    res.json(result)
    console.log(result)
  })
})

api.get("/getalldata", (req,res) =>{
  let keyword = req.query.keyword
  db_calls.getAllData(keyword).then((result) =>{
    res.json(result)
    console.log(result)
  })
})

api.get("/incrementflags", (req,res) =>{
  let user_id = req.query.user_id
  db_calls.incUserFlags(user_id)
  res.json({"message": "done"})
})

api.get("/suspendUser", (req,res) =>{
  let user_id = req.query.user_id
  db_calls.susUserFlags(user_id)
  res.json({"message": "done"})
})

api.get('/resetflags', (req,res) =>{
  let user_id = req.query.user_id
  db_calls.resetFlags(user_id)
  res.json({"message": "done"})
})

api.get("/suspendDocFlags", (req,res) =>{
  let doc_id = req.query.doc_id;
  db_calls.suspendDocFlags(doc_id)
  res.json({"message": "done"})
})

api.get("/resetDocFlags", (req,res) =>{
  let doc_id = req.query.doc_id;
  db_calls.resetDocFlags(doc_id)
  res.json({"message": "done"})
})

api.get("/doctor_signup", (req,res) =>{
  let queries = req.query;
  let doc_id = "17" + Date.now()
  let doctor_data = {
      id: doc_id,
      first_name: queries.first_name,
      last_name: queries.last_name,
      email: queries.email,
      date_of_birth: queries.date_of_birth,
      password: queries.password,
      phone_number: queries.phone_number,
      national_id: queries.national_id,
      medical_info:{},
      clinic_info:[]
  }
  
  db_calls.AddDoctorsData(doctor_data).then((result) => {
    res.json(result)
    console.log(result)
  })
})

api.get("/getUser", (req,res) =>{
  let user_id = req.query.user_id
  db_calls.queryUser(user_id).then((result) =>{
    res.json(result);
    console.log(result);
  })
})

api.get("/saveUserInfo", (req,res) =>{
  let user_id = req.query.id
  let bday = req.query.date_of_birth
  let fname = req.query.first_name
  let lname = req.query.last_name
  let email = req.query.email
  let gender = req.query.gender
  let national_id = req.query.national_id
  let password = req.query.password
  let phone_number = req.query.phone_number

  let usrData = {
    date_of_birth: bday,
    email: email,
    first_name: fname,
    gender: gender,
    id: user_id,
    last_name: lname,
    national_id: national_id,
    password: password,
    phone_number: phone_number,
  }
  db_calls.editUserInfo(usrData).then((result) => {
   res.json(result)
  })
  //console.log("func is done")
 //  res.json({message:"success"})
 //})
 
})


api.get("/appointments_history", (req,res) => {
  let queries = req.query;
  let doc_id = queries.doc_id;
  db_calls.readHistory(doc_id).then((result) => {
    res.json(result)
    console.log(result);
  })
})
// app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // 


api.get("/set_appointment", (req, res) => {
  let queries = req.query;
  let doc_id = queries.doc_id;
  let user_id = queries.user_id;
  let visit_id = queries.visit_id
  let user_time = queries.user_time;
  let date_stamp = queries.date_stamp
  let status_code = queries.status_code;
  let reason_code = queries.reason_code;
  let fees = queries.fees;
  let clinic_code = queries.clinic_code
  db_calls.setAppointments(doc_id, user_id,visit_id, user_time,date_stamp,status_code, reason_code,fees,clinic_code).then(() => {
    console.log("appointment reserved.")
  })
})


api.get("/getAppointments", (req, res) => {
  let doc_id = req.query.doc_id;
  db_calls.getAppointments(doc_id).then((result) => {
    res.json(result)
    console.log(result);
  })
})

api.get("/status_appointment", (req,res) => {
  let queries = req.query;
  let doc_id = queries.doc_id;
  let user_id = queries.user_id;
  let visit_id = queries.visit_id;
  let user_time = queries.user_time;
  let status_code = queries.status_code;
  let date_stamp = queries.date_stamp;
  let reason_code = queries.reason_code;
  let fees = queries.fees;
  let prescription = queries.prescription;
  let clinic_code = queries.clinic_code
  db_calls.statusAppointment(doc_id, user_id,  visit_id,user_time, status_code,date_stamp, reason_code,fees,prescription, clinic_code).then(() => {
    console.log("appointment status updated")
    res.json({msg:"appointment status updated"})
  })
})

api.get("/getRatings", (req, res) =>{
  let doc_id = req.query.doc_id;
  db_calls.getRatings(doc_id).then((result) => {
    res.json(result)
    console.log(result)
  })
})

api.get("/setRatings", (req, res) =>{
  let doc_id = req.query.doc_id;
  let user_id = req.query.user_id;
  let user_rate = req.query.user_rate;

  db_calls.setRatings(doc_id, user_id, user_rate).then(() => {
    res.json({message:"Success"})
    console.log("Success!")
  })
})

api.get("/getReviews", (req, res) =>{
  let doc_id = req.query.doc_id;
  db_calls.getReviews(doc_id).then((result) => {
    res.json(result)
    console.log(result)
  })
})

api.get("/setReviews", (req, res) =>{
  let doc_id = req.query.doc_id;
  let user_id = req.query.user_id;
  let user_review = req.query.user_review;
  let user_rating = req.query.user_rating;
  let visit_id = req.query.visit_id;
  let date_stamp = req.query.date_stamp;
  let user_name = req.query.user_name;

  db_calls.setReviews(doc_id, user_id, user_review, user_rating, visit_id, date_stamp, user_name).then(() => {
    res.json({message:"Success"})
    console.log("Success!")
  })
})

api.get("/getUserAppointments", (req,res) =>{
  let user_id = req.query.user_id

  db_calls.getUserAppointments(user_id).then((result) =>{
    res.json(result)
  })
})


api.get("/search", (req,res) =>{
  let seacrhQuery = req.query.q

  db_calls.getSearchDoctor(seacrhQuery).then((result) =>{
    res.json(result)
  })
})

api.post("/addNewDoctor", (req, res) =>{
    let data = req.body
    res.json(data)
    console.log(data)
    db_calls.AddDoctorsData(JSON.parse(data))
})
exports.api = functions.https.onRequest(api);




