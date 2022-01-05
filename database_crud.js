const { MongoClient } = require('mongodb');



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

        /*
        await createListing(client,
            {
                name: "zibby",
                summary: "A charming loft in Paris",
                bedrooms: 1,
                bathrooms: 1
            }
        );
        */
       
        await createMultipleListings(client, [
            {
                name: "Infinite Views",
                summary: "Modern home with infinite views from the infinity pool",
                property_type: "House",
                bedrooms: 5,
                bathrooms: 4.5,
                beds: 5
            },
            {
                name: "Private room in London",
                property_type: "Apartment",
                bedrooms: 1,
                bathroom: 1
            },
            {
                name: "Beautiful Beach House",
                summary: "Enjoy relaxed beach living in this house with a private beach",
                bedrooms: 4,
                bathrooms: 2.5,
                beds: 7,
                last_review: new Date()
            }
        ]);

    } catch(e){

        console.error(e);

    }finally {

        // Close the connection to the MongoDB cluster
        await client.close();

    }
}

main().catch(console.error);

// Add functions that make DB calls here
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db =>console.log(` - ${db.name}`));
}

async function createListing(client, newListing) {
    const result = await client.db("doctors_database").collection("doctors_collection").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function createMultipleListings(client, newListings){
    const result = await client.db("doctors_database").collection("doctors_collection").insertMany(newListings);

    console.log(`${result.insertedCount} new listings(s) created with the following id(s):`);
    console.log(result.insertedIds);
}

