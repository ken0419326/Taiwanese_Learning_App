// Load the MongoDB Node.js driver
const { MongoClient } = require("mongodb");
const fs = require("fs");

// MongoDB connection URI
const uri = "mongodb://localhost:27017";

// MongoDB database and collection names
const dbName = "ohtaibunDB_1";
const collectionNames = ["coursecontents"];

// Path to the CSV file
const csvFilePaths = ["./course-content.csv"];

for (let i = 0; i < collectionNames.length; i++) {
  importCSV(collectionNames[i], csvFilePaths[i]);
}

async function importCSV(collectionName, csvFilePath) {
  try {
    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    // Select the database
    const db = client.db(dbName);

    // Select the collection
    const collection = db.collection(collectionName);

    // Read the CSV file
    console.log(csvFilePath);
    const csvData = fs.readFileSync(csvFilePath, "utf-8");

    // Convert CSV data to array of objects
    const lines = csvData.trim().split("\n");
    const headers = lines.shift().split(",");
    const objects = lines.map((line) => {
      // const values = line.split(",");
      const values = parseCSVLine(line);
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

// Function to parse a CSV line correctly
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && insideQuotes && line[i + 1] === '"') {
      // Handle escaped quotes
      // current += '"';
      i++; // Skip the next quote
    } else if (char === '"') {
      // Toggle insideQuotes flag
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      // Field separator
      result.push(current);
      current = "";
    } else {
      // Regular character
      current += char;
    }
  }

  result.push(current); // Push the last field
  return result;
}
