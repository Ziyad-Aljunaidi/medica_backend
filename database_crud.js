const { MongoClient } = require('mongodb');
const ReadData = require("./passToDoctorsDb.js");
const fs = require('fs');
let doctorsDataFolder = fs.readdirSync('./new_final_data_json');

async function main() {
    
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */

    const uri = `mongodb+srv://ziyad_db:MacNCheese59@cluster0.jy6bo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */

    const client = new MongoClient(uri);

    try {

        // Connect to the MongoDB cluster
        await client.connect();
        await listDatabases(client);

        // Make the appropriate DB calls

        //await createListing(client, {Json Object});
        //for(let i = 0; i<doctorsDataFolder.length; i++){
        //    await createMultipleListings(client, ReadData.ExportDocsData(doctorsDataFolder[i].replace(".json", "")));
        //}
        

        // await findOneListingByName(client, "Dr. Omar Rodwan");
        
        await findListings(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBathrooms: 2,
            maximumNumberOfResults: 5
        });

    } catch(e){

        console.error(e);

    }finally {

        // Close the connection to the MongoDB cluster
        await client.close();

    }
}

main().catch(console.error);

// Add functions that make DB calls here

// Function to read collection in the database
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db =>console.log(` - ${db.name}`));
}

// Function to create a single document in database
async function createListing(client, newListing) {
    const result = await client.db("doctors_database").collection("doctors_database").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

// Function to create a multiple documents in database
async function createMultipleListings(client, newListings){
    const result = await client.db("doctors_database").collection("doctors_collection").insertMany(newListings);

    console.log(`${result.insertedCount} new listings(s) created with the following id(s):`);
    console.log(result.insertedIds);
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

async function findListings(client, {

    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
    const cursor = client.db("doctors_database").collection("doctors_collection").find(
                            {
                                city:"Warman"   
                            }
                            );
                           //.sort({ last_review: -1 })
                           //.limit(maximumNumberOfResults);

    const results = await cursor.toArray();

    if (results.length > 0) {
        //console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
           // date = new Date(result.last_review).toDateString();

            //console.log();
            //console.log(`${i + 1}. name: ${result.name}`);
            //console.log(`   _id: ${result._id}`);
            //console.log(`   bedrooms: ${result.bedrooms}`);
            //console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(result)
            console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`);
        });
    } else {
        //console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
        console.log("not found")
    }
}
