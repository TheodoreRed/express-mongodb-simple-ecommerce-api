import express from "express";
import { errorResponse } from "./productRouter";
import { getClient } from "../db";
import User from "../models/User";
import { ObjectId } from "mongodb";
const usersRouter = express.Router();

// GET
usersRouter.get("/:id", async (req, res) => {
  const idImLookingFor = req.params.id;

  try {
    const client = await getClient();
    const foundUser: User | null = await client
      .db()
      .collection<User>("users")
      .findOne({ _id: new ObjectId(idImLookingFor) });

    if (foundUser) {
      res.status(200).json(foundUser);
    } else {
      res
        .status(404)
        .json({ message: `User with ID: ${idImLookingFor} not found.` });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// POST
usersRouter.post("/", async (req, res) => {
  const newObj: User = req.body;
  try {
    const client = await getClient();
    await client.db().collection<User>("users").insertOne(newObj);
    res.status(201).json(newObj);
  } catch (err) {
    errorResponse(err, res);
  }
});

// PUT
usersRouter.put("/:id", async (req, res) => {
  // which user to replace
  const idToReplace: string = req.params.id;

  const updatedObj: User = req.body;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .replaceOne({ _id: new ObjectId(idToReplace) }, updatedObj);

    if (result.matchedCount) {
      res.status(200).json(updatedObj);
    } else {
      res.status(404).json({ message: `ID: ${idToReplace} not found` });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// DELETE
usersRouter.delete("/:id", async (req, res) => {
  const idToDelete: string = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .deleteOne({ _id: new ObjectId(idToDelete) });

    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: `ID: ${idToDelete} not found` });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default usersRouter;
