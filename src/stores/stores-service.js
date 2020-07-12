const storeService = {
  getAllStores(knex) {
    return knex.select("*").from("shoppa_store");
  },
  insertStore(knex, newStore) {
    return knex
      .insert(newStore)
      .into("shoppa_store")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from("shoppa_store").select("*").where("id", id).first();
  },
  deleteStore(knex, id) {
    return knex("shoppa_store").where({ id }).delete();
  },
  updateStore(knex, id, newStoreField) {
    return knex("shoppa_store").where({ id }).update(newStoreField);
  },
};
