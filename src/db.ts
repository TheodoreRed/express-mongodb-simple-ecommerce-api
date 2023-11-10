// Import MongoClient from the mongodb package to interact with MongoDB
import { MongoClient } from "mongodb";
// Import dotenv to manage environment variables from a .env file
import dotenv from "dotenv";
// Execute the config function from dotenv to load environment variables
dotenv.config();

// Retrieve the MongoDB connection URI from environment variables or use an empty string if not defined
const uri: string = process.env.URI || "";
// Create a new MongoClient instance with the MongoDB URI
const client: MongoClient = new MongoClient(uri);

// Export a function named getClient
export const getClient = async () => {
  // Connect to the MongoDB client, awaiting the connection to be established
  await client.connect();
  // Return the connected client instance for use in other parts of the application
  return client;
};
