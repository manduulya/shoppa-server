const shoppingListService = {
  getAllShoppingList(knex) {
    return knex.select("*").from("shoppa_shoppinglists");
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
      .from("shoppa_shoppinglists")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteShoppingList(knex, id) {
    return knex("shoppa_shoppinglists").where({ id }).delete();
  },
  updateShoppingList(knex, id, newStoreField) {
    return knex("shoppa_shoppinglists").where({ id }).update(newStoreField);
  },
};

module.exports = shoppingListService;
