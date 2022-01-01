const express = require("express");
const jsonData = require("./jsonDataScript.js");
const app = express();
var url = require("url");

const port = 3000;

//var url_parts = url.parse(request.url, true);
//var query = url_parts.query;

app.get("/doctor", (req, res) =>{
  if( req.query.city === "undefined"){
    console.log("aa")
  }
  else{
    res.send(jsonData.GetDocsInCity(req.query.city));
  }
  //res.send(jsonData.GetDocsInCity(req.query.city))
  //
});


app.get("/products", (req,res) => {
   const products = [
     {
       id: 1,
       name: "hammer",
     },
     {
       id: 2,
       name: "screwdriver",
     },
     ,
     {
       id: 3,
       name: "wrench",
     },
   ];

  res.json(products);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));