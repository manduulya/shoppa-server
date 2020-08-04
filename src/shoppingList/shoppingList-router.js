const express = require("express");
const { shoppingList } = require("../dummyStore");
const shoppingListRouter = express.Router();
const bodyParser = express.json();
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
    const { title, stores = [], items = [] } = req.body;
    const newShoppingList = { title };
    if (!title) {
      res.status(400).json({
        error: { message: `Missing shoppingList name in the request body` },
      });
    }

    shoppingListService
      .insertShoppingList(knexInstance, newShoppingList)
      .then((dbSL) => {
        const storePromises = [];
        for (const store of stores) {
          const newStore = { name: store.name, shopping_list_id: dbSL.id };
          storePromises.push(storeService.insertStore(knexInstance, newStore));
        }

        return Promise.all([dbSL, ...storePromises]);
      })
      .then(([dbSL, ...dbStores]) => {
        const itemPromises = [];

        for (let i = 0; i < stores.length; ++i) {
          for (const item of items[stores[i].id]) {
            const newItem = {
              name: item.name,
              store_id: dbStores[i].id,
            };
            itemPromises.push(itemService.insertItem(knexInstance, newItem));
          }
        }

        return Promise.all([dbSL, dbStores, ...itemPromises]);
      })
      .then(([dbSL, dbStores, ...dbItems]) => {
        const shoppingList = {
          id: dbSL.id,
          title: dbSL.title,
          stores: dbStores,
          items: {},
        };

        for (const dbStore of dbStores)
          shoppingList.items[dbStore.id] = dbItems.filter(
            (i) => i.store_id === dbStore.id
          );

        return res.status(201).json({ shoppingList });
      });
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
    const knexInstance = req.app.get("db");
    const { id } = req.params;
    shoppingListService.deleteShoppingList(knexInstance, id).then(() => {
      res.status(204).end();
    });
  });
shoppingListRouter
  .route("/edit/:id")
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
  });

module.exports = shoppingListRouter;
