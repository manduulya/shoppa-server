const storeService = {
  getAllStores(knex) {
    return knex.select("*").from("shoppa_shoppingList");
  },
  insertStore(knex, newStore) {
    return knex
      .insert(newStore)
      .into("shoppa_shoppingList")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from("shoppa_shoppingList").select("*").where("id", id).first();
  },
  deleteStore(knex, id) {
    return knex("shoppa_shoppingList").where({ id }).delete();
  },
  updateStore(knex, id, newStoreField) {
    return knex("shoppa_shoppingList").where({ id }).update(newStoreField);
  },
};
