const express = require("express");
const { shoppingList } = require("../dummyStore");
const shoppingListRouter = express.Router();
const bodyParser = express.json();
const dummyStore = require("../dummyStore");

shoppingListRouter
  .route("/shoppinglist")
  .get((req, res) => {
    res.json(dummyStore.shoppingList);
  })
  .post(bodyParser, (req, res) => {
    const { title, items, stores } = req.body;
    const newShoppingList = { title, items, stores };

    if (!title) {
      res.status(400).json({
        error: { message: `Missing shoppingList name in the request body` },
      });
    }
    shoppingList.push(newShoppingList);
    res.status(201).json(newShoppingList);
  });
shoppingListRouter
  .route("/shoppinglist/:id")
  .get((req, res) => {
    const { id } = req.params;
    const sl = dummyStore.shoppingList.find((s) => s.id == id);
    if (!id) {
      return res.status(404).json({ error: { message: `Store not found` } });
    }
    res.json(sl);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const index = dummyStore.shoppingList.findIndex((s) => s.id === id);
    console.log(index);

    if (index === -1) {
      return res.status(404).json({ error: { message: "Not Found" } });
    }
    dummyStore.shoppingList.splice(index, 1);
    res.status(204).end();
  });

module.exports = shoppingListRouter;
