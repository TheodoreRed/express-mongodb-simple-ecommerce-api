import express from "express";
import { getClient } from "../db";
import Product from "../models/Product";
import { ObjectId } from "mongodb";

const productsRouter = express.Router();

export const errorResponse = (error: any, res: any): void => {
  console.log("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};
//----------------------------------------------------------------------------
//------------------------------------------------------------------
// build endpoints
productsRouter.get("/", async (req, res) => {
  const maxPrice = +(req.query["max-price"] as string);
  const { includes } = req.query;
  const { limit } = req.query;
  const queryObj: any = {};

  if (maxPrice) {
    queryObj.price = { $lte: maxPrice };
  }
  if (includes) {
    queryObj.name = new RegExp(includes as string, "i");
  }

  try {
    // connect to driver
    const client = await getClient();

    // get all products from mongodb collection
    let myMongoCommand = await client
      .db()
      .collection<Product>("products")
      .find(queryObj);

    if (limit) {
      myMongoCommand = myMongoCommand.limit(+(limit as string));
    }
    const allProducts: Product[] = await myMongoCommand.toArray();
    res.status(200).json(allProducts);
  } catch (err) {
    errorResponse(err, res);
  }
});

productsRouter.get("/:id", async (req, res) => {
  const idImLookingFor: string = req.params.id;

  try {
    const client = await getClient();
    // get all products from mongodb collection
    let foundProduct: Product | null = await client
      .db()
      .collection<Product>("products")
      .findOne({ _id: new ObjectId(idImLookingFor) });
    if (foundProduct) {
      res.json(foundProduct).status(200);
    } else {
      res.status(404).json({ message: `ID: ${idImLookingFor} not found` });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

productsRouter.post("/", async (req, res) => {
  const newObj: Product = req.body;
  try {
    const client = await getClient();
    await client.db().collection<Product>("products").insertOne(newObj);
    res.status(201).json(newObj);
  } catch (err) {
    errorResponse(err, res);
  }
});

productsRouter.put("/:id", async (req, res) => {
  // which product to replace
  const idToReplace: string = req.params.id;

  const updatedObj: Product = req.body;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Product>("products")
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

productsRouter.delete("/:id", async (req, res) => {
  const idToDelete: string = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Product>("products")
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

// PATCH is for updating very specific
productsRouter.patch("/:id/sale", async (req, res) => {
  const idToUpdate: string = req.params.id;
  // what discount to do
  const discount: number = req.body.discount;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Product>("products")
      .updateOne(
        { _id: new ObjectId(idToUpdate) },
        { $mul: { price: 1 - discount } }
      );

    if (result.matchedCount) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ message: `ID: ${idToUpdate} not found` });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default productsRouter;
