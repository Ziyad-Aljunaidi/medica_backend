const express = require("express");
const jsonData = require("./jsonDataScript.js");
const app = express();
var url = require("url");
const database_manipulation = require("./database_manipulation.js")

const port = 3000;

//var url_parts = url.parse(request.url, true);
//var query = url_parts.query;
function searchQuery(urlQuery, data){
  try{
    if(urlQuery.length != 0){
      if(urlQuery.city){
        console.log(urlQuery.city + " MEOW ")
        data =  database_manipulation.findListings("city", urlQuery.city).then((result) => {
          console.log(result);
          console.log("FINAL1");
          return result;
        });
      } else if(urlQuery.speciality){
        console.log(urlQuery.speciality)
        data =  database_manipulation.findListings("speciality", urlQuery.speciality).then((result) => {
          console.log(result);
          console.log("FINAL2");
          return result;
        });
      } else if (urlQuery.id){
        console.log(urlQuery.id)
        data =  database_manipulation.findListings("id", urlQuery.id).then((result) => {
          console.log(result);
          console.log("FINAL3");
          return result;
        });
      }
    }else{
      console.log("no url queries found.")
    }
  }catch(e){
    console.error(e);
  }
}

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
  let urlQuery = req.query;
  //console.log(create_doctor)
  let data = []
  searchQuery(urlQuery, data);
  //console.log(req.query)

  //let data =  database_manipulation.findListings("id", id).then((result) => {
  //  console.log(result," ",id);
  //  res.json(result)
  //});
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // 

