const { MongoClient } = require("mongodb");
const fs = require("fs");

// MongoDB connection URI
const uri = "mongodb://localhost:27017";

// MongoDB database and collection names
const dbName = "ohtaibunDB_1";
const collectionName = "CourseContent";

// Function to list all documents in the collection
async function listAllDocuments() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB");

    // Select the database
    const db = client.db(dbName);

    // Select the collection
    const collection = db.collection(collectionName);

    // Find all documents in the collection
    const documents = await collection.find().toArray();

    // Log all documents
    console.log("Documents in the collection:");
    console.log(documents);

    // Close the connection
    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
  }
}

listAllDocuments();
