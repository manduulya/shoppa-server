const express = require("express");
const { item } = require("../dummyStore");
const itemsRouter = express.Router();
const bodyParser = express.json();
const itemService = require("./items-service");

itemsRouter
  .route("/items")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    itemService
      .getAllItems(knexInstance)
      .then((items) => {
        res.json(items);
      })
      .catch(next);
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
itemsRouter.route("/item/:ls_id").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  const { sl_id } = req.params;
  itemService
    .getBySlId(knexInstance, sl_id)
    .then((list) => {
      res.json(list);
    })
    .catch(next);
});
itemsRouter
  .route("/items/:id")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ error: { message: `Store not found` } });
    }
    itemService
      .getById(knexInstance, id)
      .then((item) => {
        res.json(item);
      })
      .catch(next);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const knexInstance = req.app.get("db");
    itemService.deleteItem(knexInstance, id).then(() => res.status(204).end());
  });

module.exports = itemsRouter;
