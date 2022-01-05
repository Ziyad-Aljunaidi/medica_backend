const express = require("express");
const jsonData = require("./jsonDataScript.js");
const app = express();
var url = require("url");

const port = 3000;

//var url_parts = url.parse(request.url, true);
//var query = url_parts.query;

app.get("/doctor", (req, res) =>{

  if(req.query.speciality != "undefined"){
    res.send(JSON.stringify(jsonData.GetDocSpeciality(jsonData.GetDocsInCity(req.query.city), req.query.speciality), null, 2));
  }
  //res.send(jsonData.GetDocsInCity(req.query.city));
});

app.get("/products", (req,res) => {
  const products = [];
  res.json(products);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)); // 