require('dotenv').config();
const express = require("express");
//const jsonData = require("./jsonDataScript.js");
const app = express();
var url = require("url");
const database_manipulation = require("./database_manipulation.js")

// using the PORT in the .env file
const port = process.env.PORT;

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
    return data;
  }catch(e){
    console.error(e);
  }
}

app.get("/", (req, res) =>{
  res.send("WELCOME TO MEDICA72.COM API")
});

app.get("/api/doctor", (req,res) => {
  let urlQuery = req.query;
  console.log(urlQuery.city, urlQuery.id, urlQuery.speciality)
  if(Object.keys(urlQuery).length != 0){
    searchQuery(urlQuery).then((result) =>{
      res.json(result);
    });
    
  }else{
    console.log("NO QUERY FOUND! ;(")
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // 

