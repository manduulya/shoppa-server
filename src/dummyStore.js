module.exports = {
  user: [
    {
      id: 1,
      Name: "Mynameis",
      password: "mypassword",
    },
  ],
  shoppingList: [
    {
      title: "new list",
      items: {
        costco: ["apple", "banana", "orange", "eggs", "milk"],
      },
      stores: [
        {
          id: 1,
        },
        {
          name: "costco",
        },
      ],
    },
  ],
  store: [
    {
      id: 1,
      name: "target",
      shoppingListId: 1,
    },
  ],
  item: [
    {
      id: 1,
      name: "apple",
      store_id: 1,
    },
  ],
};
