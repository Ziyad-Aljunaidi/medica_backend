/*
This script is intend for testing api requests & responses, 
and its no way near a secure nor functional database alternative.
*/

'use strict';

const fs = require('fs');

let doctorsDataFolder = fs.readdirSync('./final_data');
console.log(doctorsDataFolder);

function GetDocsInCity(cityName)
{
    cityName = cityName.toLowerCase();

    let doctorFile = fs.readFileSync(`./final_data/${cityName}.json`)
    let doctorJson = JSON.parse(doctorFile);
    let doctorJsonLength = Object.keys(doctorJson.doctors).length;
    

    //console.log(Object.keys(doctorJson.doctors).length)
    return doctorJson;
}
//console.log(GetDocsInCity("warman"));

module.exports = {
    GetDocsInCity,
};