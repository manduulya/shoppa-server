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
storeRouter.route("/store/:sl_id").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  const { sl_id } = req.params;
  storeService
    .getbySlId(knexInstance, sl_id)
    .then((list) => {
      res.json(list);
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
