const express = require("express");
const { store } = require("../dummyStore");
const storeService = require("./stores-service");
const storeRouter = express.Router();
const bodyParser = express.json();

storeRouter
  .route("/stores")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    storeService
      .getAllStores(knexInstance)
      .then((stores) => {
        res.json(stores);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { name } = req.body;
    const newStore = { name };

    if (!name) {
      res
        .status(400)
        .json({ error: { message: `Missing store name in the request body` } });
    }
    storeService
      .insertStore(knexInstance, newStore)
      .then((store) => {
        res.status(201).json(store);
      })
      .catch(next);
  });
storeRouter
  .route("/stores/:id")
  .get((req, res) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    storeService.getById(knexInstance, id).then((store) => {
      res.json(store);
    });
  })
  .delete((req, res) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    storeService
      .deleteStore(knexInstance, id)
      .then(() => res.status(204).end());
  });

module.exports = storeRouter;
