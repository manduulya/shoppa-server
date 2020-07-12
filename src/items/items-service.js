const storeService = {
  getAllStores(knex) {
    return knex.select("*").from("shoppa_items");
  },
  insertStore(knex, newStore) {
    return knex
      .insert(newStore)
      .into("shoppa_items")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from("shoppa_items").select("*").where("id", id).first();
  },
  deleteStore(knex, id) {
    return knex("shoppa_items").where({ id }).delete();
  },
  updateStore(knex, id, newStoreField) {
    return knex("shoppa_items").where({ id }).update(newStoreField);
  },
};
