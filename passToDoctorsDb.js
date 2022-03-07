/*
This script is intend for testing api requests & responses, 
and its no way near a secure nor functional database alternative.
*/
'use strict';

const { json } = require('body-parser');
const fs = require('fs');

let doctorsDataFolder = fs.readdirSync('./functions/new_final_data_json');

// Function to get all the doctors in specific city
function GetDocsInCity(cityName)
{
    cityName = cityName.toLowerCase();

    let doctorFile = fs.readFileSync(`./functions/new_final_data_json/${cityName}.json`)
    let doctorJson = JSON.parse(doctorFile);
    let doctorJsonLength = Object.keys(doctorJson).length;

    return doctorJson;
}


function ExportDocsData(cityname){
    let doctorJson = GetDocsInCity(cityname);
    let docList = [];
    let doctorJsonLength = Object.keys(doctorJson).length;

    for(let i = 0; i<doctorJsonLength; i++){

        let doc_obj = doctorJson[i];
        
        let final_doc_obj = 
        {
            "name": doc_obj.name,
            "id": doc_obj.id,
            "clinic": doc_obj.clinic,
            "address1": doc_obj.address1,
            "address2": doc_obj.address2,
            "address": doc_obj.address,
            "city": cityname,
            "phone": doc_obj.phone,
            "gender": doc_obj.gender,
            "google-map": doc_obj["google-map"],
            "qualification": doc_obj.qualification,
            "speciality": doc_obj.speciality,
            "url": doc_obj.url
            
        }

        docList.push(final_doc_obj)
    }
    return docList;
}



console.log(ExportDocsData("warman"))
// console.log(doctorsDataFolder.length)

module.exports = {
    GetDocsInCity,
    ExportDocsData,
};