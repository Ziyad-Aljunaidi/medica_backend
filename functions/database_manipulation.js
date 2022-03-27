
require('dotenv').config();
const { MongoClient, MongoMissingCredentialsError } = require('mongodb');
//const ReadData = require("./passToDoctorsDb.js");
const fs = require('fs');
const { monitorEventLoopDelay } = require('perf_hooks');
//let doctorsDataFolder = fs.readdirSync('./new_final_data_json');

async function findListings(operation, arg) {
    // arg could be [city, speciality, id]
    const uri = process.env.DB_CALL;

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster.
        await client.connect();
        //await listDatabases(client);
        // Make the appropriate DB calls.
        switch(operation){
            // Read all listings by url.query.
            case "city":
                data = await findListingsByCity(client,arg);
                return data;
            case "speciality":
                data = await findListingsBySpeciality(client, arg);
                return data;
            case "id":
                data = await findListingsByDoctorID(client, arg);
                return data;
        }

    } catch(e){

        console.error(e);
        return 0;
    }finally {

        // Close the connection to the MongoDB cluster
        await client.close();

    }
}

// -----Add functions that make DB calls here----- 

// Function to read collection in the database
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db =>console.log(` - ${db.name}`));
}

// Function to Find only one Document
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("doctors_database").collection("doctors_collection").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

//Search for all valid listings matching city name.
async function findListingsByCity(client, cityname) {
    const cursor = client.db("doctors_database").collection("doctors_collection").find({city:cityname}).sort({ last_review: -1 })

    const results = await cursor.toArray();

    if (results.length > 0) {
 
        return results;
    } else {
        console.log("No listings found :(")
        return 0;
    }
}

//Search for all valid listings matching city name.
async function findListingsBySpeciality(client, speciality) {
    const cursor = client.db("doctors_database").collection("doctors_collection").find({speciality: speciality}).sort({ last_review: -1 })
    const results = await cursor.toArray();

    if (results.length > 0) {
        return results;
    } else {
        console.log("No listings found :(")
        return 0;
    }
}

//Search for all valid listings matching doctor ID.
async function findListingsByDoctorID(client, doctor_id) {
    const cursor = client.db("doctors_database").collection("doctors_collection").find({id: doctor_id}).sort({ last_review: -1 })

    const results = await cursor.toArray();

    if (results.length > 0) {
        
        return results;
    } else {
        console.log("No listings found :(")
        return 0;
    }
}

module.exports = {
    findListings,
};