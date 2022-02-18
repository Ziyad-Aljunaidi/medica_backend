require('dotenv').config();
const express = require("express");
//const jsonData = require("./jsonDataScript.js");
const app = express();
var url = require("url");
const database_manipulation = require("./database_manipulation.js")

const port = process.env.PORT;

//var url_parts = url.parse(request.url, true);
//var query = url_parts.query;
function searchQuery(urlQuery, data){
  try{
    if(urlQuery.length != 0){
      if(urlQuery.city){
        console.log(urlQuery.city + " MEOW ")
         data = database_manipulation.findListings("city", urlQuery.city);
         return data;
        
      } 
      else if(urlQuery.speciality){
        console.log(urlQuery.speciality)
        data =  database_manipulation.findListings("speciality", urlQuery.speciality)
          return data;
        
      } else if (urlQuery.id){
        console.log(urlQuery.id)
        data =  database_manipulation.findListings("id", urlQuery.id);
        return data;
      }
      
    }
    else{
      //console.log("no url queries found.")
    }
    
  }catch(e){
    //console.error(e);
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
  let jsondata = []
  async function meow(haha){
    haha = await database_manipulation.findListings("id", urlQuery.id);
    return haha;
  }  
  //meow().then((result) =>{
  //  console.log(result)
  //})
  
  searchQuery(urlQuery).then((result) =>{
    console.log(result);
    res.json(result);
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // 

