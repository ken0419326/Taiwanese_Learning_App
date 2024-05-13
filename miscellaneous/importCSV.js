// Load the MongoDB Node.js driver
const { MongoClient } = require("mongodb");
const fs = require("fs");

// MongoDB connection URI
const uri = "mongodb://localhost:27017";

// MongoDB database and collection names
const dbName = "ohtaibunDB_1";
const collectionName = "coursequizzes";

// Path to the CSV file
const csvFilePath = "./course-quiz.csv";

async function importCSV() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB");

    // Select the database
    const db = client.db(dbName);

    // Select the collection
    const collection = db.collection(collectionName);

    // Read the CSV file
    const csvData = fs.readFileSync(csvFilePath, "utf-8");

    // Convert CSV data to array of objects
    const lines = csvData.trim().split("\n");
    const headers = lines.shift().split(",");
    const objects = lines.map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index].trim();
        return obj;
      }, {});
    });

    // Insert data into the collection
    const result = await collection.insertMany(objects);
    console.log(
      `Inserted ${result.insertedCount} documents into ${collectionName}`
    );

    // Close the connection
    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the importCSV function
importCSV();
