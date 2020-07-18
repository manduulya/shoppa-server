const itemService = {
  getAllItems(knex) {
    return knex.select("*").from("shoppa_items");
  },
  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into("shoppa_items")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from("shoppa_items").select("*").where("id", id).first();
  },
  deleteItem(knex, id) {
    return knex("shoppa_items").where({ id }).delete();
  },
  updateItem(knex, id, newItemField) {
    return knex("shoppa_items").where({ id }).update(newItemField);
  },
};
module.exports = itemService;
