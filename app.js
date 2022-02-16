const express = require("express");
const jsonData = require("./jsonDataScript.js");
const app = express();
var url = require("url");
const database_manipulation = require("./database_manipulation.js")

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
  const products = ["aa", "aaa"];
  res.json(products);
});


app.get("/api/doctor", (req,res) => {
  let city = req.query.city;
  let speciality = req.query.speciality;
  let id = req.query.id;
  let create_doctor = req.query.create_doctor;
  //console.log(create_doctor)
  let data =  database_manipulation.findListings("id", id).then(function(result) {
    console.log(result);
    res.json(result)
  });
  
  
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // 

