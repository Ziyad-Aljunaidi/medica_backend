const express = require("express");
const jsonData = require("./jsonDataScript.js");
const app = express();
var url = require("url");

const port = 3000;

//var url_parts = url.parse(request.url, true);
//var query = url_parts.query;

app.get("/doctor", (req, res) =>{
  let city = req.query.city;
  let speciality = req.query.speciality;
  let id = req.query.id;

  // checking the city query for undefined or empty.
  if(city === ''|| typeof(city) === 'undefined'){
    console.log("ma")
  }else{
    res.json(jsonData.GetDocsInCity(city))
  }
  

  
});

app.get("/products", (req,res) => {
  const products = [];
  res.json(products);
});


app.get("/api/doctor", (req,res) => {
  let city = req.query.city;
  let speciality = req.query.speciality;
  let doctor = req.query.doctor;
  let create_doctor = req.query.create_doctor;
  //console.log(create_doctor)
  console.log(city)
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // 

