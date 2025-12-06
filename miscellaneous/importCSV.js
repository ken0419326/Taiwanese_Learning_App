const { MongoClient } = require("mongodb");
const fs = require("fs");

const uri = "mongodb://localhost:27017";
const dbName = "ohtaibunDB_1";
const collectionNames = [
  "achievements",
  "coursecontents",
  "coursequizzes",
  "coursethemes",
  "kautiansemantics",
  "kautiansentences",
  "kautianvocabs",
];
const csvFilePaths = [
  "./profile-achievement.csv",
  "./course-content.csv",
  "./course-quiz.csv",
  "./course-theme.csv",
  "./kautian-semantics.csv",
  "./kautian-sentence.csv",
  "./kautian-vocab.csv",
];

for (let i = 0; i < collectionNames.length; i++) {
  importCSV(collectionNames[i], csvFilePaths[i]);
}

async function importCSV(collectionName, csvFilePath) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Drop the collection if it exists
    try {
      await collection.drop();
      console.log(`Dropped existing collection: ${collectionName}`);
    } catch (error) {
      if (error.codeName !== "NamespaceNotFound") {
        throw error;
      } else {
        console.log(
          `Collection ${collectionName} does not exist. Skipping drop.`
        );
      }
    }

    console.log(csvFilePath);
    const csvData = fs.readFileSync(csvFilePath, "utf-8");

    const lines = csvData.trim().split("\n");
    const headers = lines.shift().split(",");

    const objects = lines.map((line) => {
      const values =
        collectionName === "kautiansentences"
          ? parseKautianSentenceCSVLine(line)
          : parseCSVLine(line);
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] =
          header.trim() === "criterion"
            ? Number(values[index].trim()) // Convert criterion to number
            : values[index].trim();
        return obj;
      }, {});
    });

    const result = await collection.insertMany(objects);
    console.log(
      `Inserted ${result.insertedCount} documents into ${collectionName}`
    );

    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && insideQuotes && line[i + 1] === '"') {
      current += '"';
      i++; // Skip the next quote
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current); // Push the last field
  return result;
}

function parseKautianSentenceCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' && insideQuotes) {
      if (line[i + 1] === '"') {
        // This is an escaped double-quote
        current += '"';
        i++; // Skip the next quote
      } else {
        // This is the closing quote
        insideQuotes = false;
      }
    } else if (char === '"' && !insideQuotes) {
      // This is the opening quote
      insideQuotes = true;
    } else if (char === "," && !insideQuotes) {
      // This is a field separator
      result.push(current);
      current = "";
    } else {
      // Any other character
      current += char;
    }
  }

  // Add the last field
  result.push(current);

  // Remove surrounding quotes from each field
  return result.map((field) => {
    return field.replace(/^"(.*)"$/, "$1");
  });
}
