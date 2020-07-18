const express = require("express");
const { shoppingList } = require("../dummyStore");
const shoppingListRouter = express.Router();
const bodyParser = express.json();
const dummyStore = require("../dummyStore");
const shoppingListService = require("./shoppingList-service");
const storeService = require("../stores/stores-service");
const itemService = require("../items/items-service");

shoppingListRouter
  .route("/shoppinglists")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    shoppingListService
      .getAllShoppingList(knexInstance)
      .then((shoppingList) => {
        res.json(shoppingList);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res) => {
    const knexInstance = req.app.get("db");
    const { title, stores, items } = req.body;
    const newShoppingList = { title };

    if (!title) {
      res.status(400).json({
        error: { message: `Missing shoppingList name in the request body` },
      });
    }
    shoppingListService
      .insertShoppingList(knexInstance, newShoppingList)
      .then((sL) => {
        for (const store of stores) {
          const newStore = { name: store.name, shopping_list_id: sL.id };
          storeService.insertStore(knexInstance, newStore).then((s) => {
            for (const item of items[store.id]) {
              console.log(store.id);
              const newItem = { name: item.name, store_id: store.id };
              itemService.insertItem(knexInstance, newItem);
            }
          });
        }
      });
    res.status(201).json(newShoppingList);
  });
shoppingListRouter
  .route("/shoppinglist/:id")
  .all((req, res, next) => {
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    shoppingListService
      .getById(knexInstance, id)
      .then((shoplist) => {
        if (!shoplist) {
          return res
            .status(404)
            .json({ error: { message: `shopping list not found` } });
        }
        res.shoplist = shoplist;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(res.shoplist);
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
