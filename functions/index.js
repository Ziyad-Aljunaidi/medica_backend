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
  send_sms.sendMsg(doc_data.name, doc_data.address, doc_data.google_map, user_phonenumber.phone_number)
}

async function send_comfirmation_test(doc_id, usr_name, user_phonenumber, user_time){
  let doc_data = await db_calls.queryDoctor(doc_id)
  //let user_phonenumber = await db_calls.queryUser(usr_id)
  //console.log(doc_data)
  //console.log(user_phonenumber)
  console.log(doc_data, usr_name , user_phonenumber, user_time)
  send_sms.sendMsgDemo(doc_data.name, doc_data.address, doc_data.google_map,usr_name, user_phonenumber, user_time)
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

api.get("/reserve" , (req,res) => {
  let urlQuery = req.query;
  let doc_id = urlQuery.doc_id;
  let usr_id = urlQuery.usr_id;
  let day = urlQuery.day;
  let time = urlQuery.time
  let doc_data 
  send_comfirmation(doc_id, usr_id)
 
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

api.get("/verify", (req, res) => {
  let urlQuery = req.query
  let doc_id = urlQuery.doc_id;
  let user_name = urlQuery.user_name;
  let user_phone = urlQuery.user_phone;
  let user_date = urlQuery.user_date;
  send_comfirmation_test(doc_id, user_name, user_phone, user_date)
  //db_calls.setAppointments(doc_id,user_id,user_time, status_code)
})


api.get("/addUser", (req, res) => {
  let queries = req.query;
  let usr_id = Date.now()
  let usr_data = {
    id: usr_id,
    first_name: queries.first_name,
    last_name: queries.last_name,
    email: queries.email,
    date_of_birth: queries.date_of_birth,
    password: queries.password,
    phone_number: queries.phone_number

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

api.get("/getUser", (req,res) =>{
  let user_token = req.query.user_token
  db_calls.queryUser(user_token).then((result) =>{
    res.json(result);
    console.log(result);
  })
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

api.get("/getAppointments", (req, res) => {
  let doc_id = req.query.doc_id;
  db_calls.getAppointments(doc_id).then((result) => {
    res.json(result)
    console.log(result);
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

  db_calls.setReviews(doc_id, user_id, user_review).then(() => {
    res.json({message:"Success"})
    console.log("Success!")
  })
})

exports.api = functions.https.onRequest(api);




