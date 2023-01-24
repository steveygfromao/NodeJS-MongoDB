const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://test:test@cluster0.ryflet6.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
     
    try {
        await client.connect();
        await createListing(client, {
            name:"Room with a view",
            summary:"A great single room",
            bedrooms:1,
            bathrooms:1
        })
        await createMultipleListing(client, [
            {
                name:"A small Loft",
                summary:"A great loft room",
                bedrooms:1,
                bathrooms:1,
                last_review: new Date()
            },
            {
                name:"Big double room with two bedrooms",
                summary:"Very large room",
                bedrooms:2,
                bathrooms:1,
                beds:2         // extra fields is fine in mongodb
            },
        ]);
        await findOneListing(client, "A small Loft");
        await findWithMinBedsAndBathrooms(client, {minbeds:4, minbaths:3});
     
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }

}


const createListing = async(client, newListing) => {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
   console.log(`New listing created with following ID: ${result.insertedId}`);
}

const createMultipleListing = async(client, newListings) => {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);
    console.log(`${result.insertedCount} new listings created with following ID(s):`);
    console.log(result.insertedIds);
 }

const findOneListing = async(client, nameOfListing) => {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing});
    if(result) {
        console.log(`Found a listing in the collection with the name ${nameOfListing}`);
        console.log(result);
    } else {
        console.log(`No listing found`);
    }
}

const findWithMinBedsAndBathrooms = async(client, { minbeds=0, minbaths=0} = {}) => {
    const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find(
        {
            bedrooms: {$gte:minbeds},
            bathrooms: {$gte:minbaths}
        }
    ).sort({last_review: -1}).limit(10);

    const results = await cursor.toArray();
    if(results.length>0) {
        results.forEach((result,i)=>{
            console.log(`${i+1}. name: ${result.name}`);
        });
    }
}


main().catch(console.error);