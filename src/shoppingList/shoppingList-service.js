function dbToExternal(results) {
  if (!results.length) return null;

  const first = results[0];

  const addedStores = new Set();
  const stores = [];
  for (const row of results) {
    if (!addedStores.has(row.store_id)) {
      stores.push({ id: row.store_id, name: row.store_name });
    }

    addedStores.add(row.store_id);
  }

  const items = {};
  for (const storeId of addedStores) {
    items[storeId] = results
      .filter((row) => row.store_id === storeId)
      .map((row) => ({ id: row.item_id, name: row.item_name }));
  }

  return {
    id: first.sl_id,
    title: first.sl_title,
    stores,
    items,
  };
}

const shoppingListService = {
  getAllShoppingList(knex) {
    return knex.select("*").from("shoppa_shoppinglists");
    // .join("shoppa_stores", "shoppa_shoppinglists.id", "=", "shopping_list_id")
    // .join("shoppa_items", "shoppa_stores.id", "=", "store_id");
  },
  insertShoppingList(knex, newShoppingList) {
    return knex
      .insert(newShoppingList)
      .into("shoppa_shoppinglists")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .select(
        "shoppa_shoppinglists.id as sl_id",
        "shoppa_shoppinglists.title as sl_title",
        "shoppa_stores.id as store_id",
        "shoppa_stores.name as store_name",
        "shoppa_items.id as item_id",
        "shoppa_items.name as item_name"
      )
      .from("shoppa_shoppinglists")
      .innerJoin(
        "shoppa_stores",
        "shoppa_shoppinglists.id",
        "shoppa_stores.shopping_list_id"
      )
      .innerJoin("shoppa_items", "shoppa_items.store_id", "shoppa_stores.id")
      .where("shoppa_shoppinglists.id", id)
      .then(dbToExternal);
  },
  deleteShoppingList(knex, id) {
    return knex("shoppa_shoppinglists").where({ id }).delete();
  },
  updateShoppingList(knex, id, newStoreField) {
    return knex("shoppa_shoppinglists").where({ id }).update(newStoreField);
  },
};

module.exports = shoppingListService;
