// require the express module
import express from "express";
import CartItem from "../models/CartItem";
import { getClient } from "../db";
import { ObjectId } from "mongodb";

const cartItemsRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

// Action: None
// Response: a JSON array of all cart items associated with the given userId.
cartItemsRouter.get("/:userId/cart", async (req, res) => {
  try {
    const userId: string = req.params.userId;
    const client = await getClient();
    const results = await client
      .db()
      .collection<CartItem>("cartItems")
      .find({ userId }, { projection: { _id: 0 } })
      .toArray();
    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

// Action: Make sure to not add a duplicate cart item for a user by using the userId and body of the request to check against existing cart items. Do one of two things after checking:
// 1. Increment the quantity
// 2. Add a cart item to the collection using the JSON body of the request.
// Response: the existing cart item with the updated quantity as JSON or the added cart item object as JSON
cartItemsRouter.post("/:userId/cart", async (req, res) => {
  try {
    const cartItem: CartItem = req.body;
    const userId: string = req.params.userId;
    const client = await getClient();
    const existingCartItem = await client
      .db()
      .collection<CartItem>("cartItems")
      .findOne(
        { userId, "product._id": new ObjectId(cartItem.product._id) },
        // Don't show the ObjectId
        { projection: { _id: 0 } }
      );
    if (existingCartItem) {
      await client
        .db()
        .collection<CartItem>("cartItems")
        .updateOne(
          { userId, "product._id": new ObjectId(cartItem.product._id) },
          { $inc: { quantity: cartItem.quantity } }
        );
      res.status(200);
      existingCartItem.quantity += cartItem.quantity;
      res.json(existingCartItem);
    } else {
      cartItem.product._id = new ObjectId(cartItem.product._id);
      await client.db().collection<CartItem>("cartItems").insertOne(cartItem);
      res.status(201);
      res.json(cartItem);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// Action: Update the quantity of a given cart item. The cart item to update is determined by the productId and userId. Set the quantity of that cart item to the quantity found in the request body.
// Response: the updated cart item object as JSON.
cartItemsRouter.patch("/:userId/cart/:productId", async (req, res) => {
  try {
    const userId: string = req.params.userId;
    const productId: string = req.params.productId;
    const updatedCartItem: CartItem = req.body;
    const client = await getClient();
    const result = await client
      .db()
      .collection<CartItem>("cartItems")
      .updateOne(
        { userId, "product._id": new ObjectId(productId) },
        { $set: { quantity: updatedCartItem.quantity } }
      );
    if (result.matchedCount) {
      res.status(200);
      res.json(updatedCartItem);
    } else {
      res.status(404);
      res.send("Not found");
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// Action: Remove a user’s cart item using the params from the request.
// Response: Empty
cartItemsRouter.delete("/:userId/cart/:productId", async (req, res) => {
  try {
    const userId: string = req.params.userId;
    const productId: string = req.params.productId;
    const client = await getClient();
    const result = await client
      .db()
      .collection<CartItem>("cartItems")
      .deleteOne({ userId, "product._id": new ObjectId(productId) });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404);
      res.send("Not found");
    }
  } catch (error) {
    errorResponse(error, res);
  }
});

// Action: Remove all of one user’s cart items using the param from the request.
// Response: Empty
cartItemsRouter.delete("/:userId/cart", async (req, res) => {
  try {
    const userId: string = req.params.userId;
    const client = await getClient();
    const result = await client
      .db()
      .collection<CartItem>("cartItems")
      .deleteMany({ userId });
    if (result.deletedCount) {
      res.sendStatus(204);
    } else {
      res.status(404);
      res.send("Not found");
    }
  } catch (error) {
    errorResponse(error, res);
  }
});

export default cartItemsRouter;
