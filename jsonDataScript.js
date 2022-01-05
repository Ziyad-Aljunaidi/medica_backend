/*
This script is intend for testing api requests & responses, 
and its no way near a secure nor functional database alternative.
*/
'use strict';

const { json } = require('body-parser');
const fs = require('fs');

let doctorsDataFolder = fs.readdirSync('./final_data');

// Function to get all the doctors in specific city
function GetDocsInCity(cityName)
{
    cityName = cityName.toLowerCase();

    let doctorFile = fs.readFileSync(`./final_data/${cityName}.json`)
    let doctorJson = JSON.parse(doctorFile);
    let doctorJsonLength = Object.keys(doctorJson.doctors).length;

    return doctorJson;
}

// Function to filter all the doctor in the city based on SPECIALITY
function GetDocSpeciality(doc_list, doctor_speciality){

    // post filter doctor list
    let post_doc_list = [];
    for(let i= 1; i<Object.keys(doc_list.doctors).length; i++){
        //console.log(doc_list.doctors[i].speciality)
        if(doc_list.doctors[i].speciality === doctor_speciality){
            let doc_obj = doc_list.doctors[i]
            post_doc_list.push(doc_obj)
        }
    }
    return post_doc_list;
}


//Function to get a specific doctor by its ID
function GetDocId(doc_list , doc_id){
    let doc_obj;
    for(let i= 1; i<Object.keys(doc_list.doctors).length; i++){
        //console.log(doc_list.doctors[i].speciality)
        if(doc_list.doctors[i].id === doc_id){
            doc_obj = doc_list.doctors[i]
            
        }
    }
    return doc_obj
}

console.log(GetDocId(GetDocsInCity('warman'), "13171"))
module.exports = {
    GetDocsInCity,
    GetDocSpeciality,
};