const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://test:test@cluster0.ryflet6.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
     
    try {
        await client.connect();
        await listdatabases(client);
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }

}

const listdatabases = async(client) => {
    const databaseList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databaseList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    });
}

main().catch(console.error);