const express = require("express");
const { item } = require("../dummyStore");
const itemsRouter = express.Router();
const bodyParser = express.json();
const dummyStore = require("../dummyStore");

itemsRouter
  .route("/items")
  .get((req, res) => {
    res.json(dummyStore.item);
  })
  .post(bodyParser, (req, res) => {
    const { id, name } = req.body;
    const newItem = { id, name };

    if (!name) {
      res.status(400).json({
        error: { message: `Missing item name in the request body` },
      });
    }
    item.push(newItem);
    res.status(201).json(newItem);
  });
itemsRouter
  .route("/items/:id")
  .get((req, res) => {
    const { id } = req.params;
    const ni = dummyStore.item.find((s) => s.id == id);
    if (!id) {
      return res.status(404).json({ error: { message: `Store not found` } });
    }
    res.json(ni);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const index = dummyStore.item.findIndex((s) => s.id === id);
    console.log(index);

    if (index === -1) {
      return res.status(404).json({ error: { message: "Not Found" } });
    }
    dummyStore.item.splice(index, 1);
    res.status(204).end();
  });

module.exports = itemsRouter;
