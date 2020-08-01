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
    const { title, stores, items } = req.body;
    const newShoppingList = { title };
    if (!title) {
      res.status(400).json({
        error: { message: `Missing shoppingList name in the request body` },
      });
    }

    shoppingListService
      .insertShoppingList(knexInstance, newShoppingList)
      .then((dbSL) => {
        /* we are creating an array of promises here,
           the idea is that instead of doing storeService.insertStore(s).then(...) multiple times
           we are going to end up with an array that is
           storePromises = [storeService.insertStore(s1), storeService.insertStore(s2), ...]
           that way we can do Promise.all(storePromises) in the end,
           the resulting promise is one that resolves to all the results (and will only do the
           next step after we have all of them */
        const storePromises = [];
        for (const store of stores) {
          const newStore = { name: store.name, shopping_list_id: dbSL.id };
          storePromises.push(storeService.insertStore(knexInstance, newStore));
        }

        return Promise.all([dbSL, ...storePromises]);
      })
      .then(
        // the result here is an array with the first element being the shopping list and
        // the rest being the stores inserted
        ([dbSL, ...dbStores]) => {
          // same idea as before
          const itemPromises = [];

          for (let i = 0; i < stores.length; ++i) {
            // dbStores[i] is the database-inserted equivalent of our original stores[i]
            // the data being posted (stores[i]) still has the cuids we created on the frontend,
            // we need that to know what items in the posted data belong to it, but we need
            // the database id (dbStores[i]) to insert it correctly

            for (const item of items[stores[i].id]) {
              const newItem = {
                name: item.name,
                sl_id: dbSL.id,
                store_id: dbStores[i].id,
              };
              itemPromises.push(itemService.insertItem(knexInstance, newItem));
            }
          }

          return Promise.all([dbSL, dbStores, ...itemPromises]);
        }
      )
      .then(
        // this now resolves only after everything is inserted,
        // this way we can now respond after all of that is done
        ([dbSL, dbStores, ...dbItems]) => {
          // build the response in the format we use on the api/frontend
          // (based on the final database data)

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
        }
      );
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
    shoppingListService.deleteShoppingList(id).then(() => {
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
