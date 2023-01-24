## NodeJS-MongoDB

## Introduction
Connect, create and read from MongoDB using Node.js.  This example uses the mongoDB driver.

Please note that you will need a cluster set up on MongoDB Atlas and copy the uri given which will need to be replaced in the code.

# Usage
`npm install`
#
To list databases in MongoDB server:

`npm run list`

#
To create a new document and read from collection:

`npm run crud`

Example of connecting to mongoDB:

```javascript
const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://test:test@cluster0.ryflet6.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);   
    try {
        await client.connect();
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }      
}
```


Example of finding documents:

```javascript
await findWithMinBedsAndBathrooms(client, {minbeds:4, minbaths:3});  // put in an async function

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
```

Example of creating a single document:

```javascript
const createListing = async(client, newListing) => {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
   console.log(`New listing created with following ID: ${result.insertedId}`);
}
```

Example of creating multiple:

```javascript
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

const createMultipleListing = async(client, newListings) => {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);
    console.log(`${result.insertedCount} new listings created with following ID(s):`);
    console.log(result.insertedIds);
}
```

Please remember that the examples use the standard mondoDB driver.  I prefer to use mongoose.
