const storeService = {
  getAllStores(knex) {
    return knex.select("*").from("shoppa_stores");
  },
  insertStore(knex, newStore) {
    return knex
      .insert(newStore)
      .into("shoppa_stores")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from("shoppa_stores").select("*").where("id", id).first();
  },
  deleteStore(knex, id) {
    return knex("shoppa_stores").where({ id }).delete();
  },
  updateStore(knex, id, newStoreField) {
    return knex("shoppa_stores").where({ id }).update(newStoreField);
  },
};

module.exports = storeService;
