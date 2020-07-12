const express = require("express");
const { store } = require("../dummyStore");
const storeRouter = express.Router();
const bodyParser = express.json();
const dummyStore = require("../dummyStore");

storeRouter
  .route("/stores")
  .get((req, res) => {
    res.json(dummyStore.store);
  })
  .post(bodyParser, (req, res) => {
    const { id, name } = req.body;
    const newStore = { id, name };

    if (!name) {
      res
        .status(400)
        .json({ error: { message: `Missing store name in the request body` } });
    }
    store.push(newStore);
    res.status(201).json(newStore);
  });
storeRouter
  .route("/stores/:id")
  .get((req, res) => {
    const { id } = req.params;
    const st = dummyStore.store.find((s) => s.id == id);
    if (!id) {
      return res.status(404).json({ error: { message: `Store not found` } });
    }
    res.json(st);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const index = dummyStore.store.findIndex((s) => s.id === Number(id));
    console.log(index);

    if (index === -1) {
      return res.status(404).json({ error: { message: "Not Found" } });
    }
    dummyStore.store.splice(index, 1);
    res.status(204).end();
  });

module.exports = storeRouter;
