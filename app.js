require('dotenv').config();
const express = require("express");
//const jsonData = require("./jsonDataScript.js");
const app = express();
var url = require("url");
const database_manipulation = require("./database_manipulation.js")

// using the PORT in the .env file
const port = process.env.PORT;

function searchQuery(urlQuery, data){
  try{
    if(urlQuery.length != 0){
      if(urlQuery.city){
        console.log(urlQuery.city)
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
      console.log("no url queries found.")
    }
    
  }catch(e){
    console.error(e);
  }
}

app.get("/", (req, res) =>{
  res.send("WELCOME TO MEDICA72.COM API")
});

app.get("/api/doctor", (req,res) => {
  let urlQuery = req.query;
  searchQuery(urlQuery).then((result) =>{
    res.json(result);
  });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // 

