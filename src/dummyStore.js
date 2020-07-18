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
      id: 1,
      title: "new list",
      items: {
        1: [
          { id: 123, name: "apple" },
          { id: 234, name: "banana" },
        ],
      },
      stores: [
        {
          id: 1,
          name: "costco",
        },
      ],
    },
    {
      id: 2,
      title: "For 4th of July",
      items: {
        1: [
          { id: 567, name: "beef" },
          { id: 678, name: "pork" },
        ],
      },
      stores: [
        {
          id: 1,
          name: "Trader Joe",
        },
      ],
    },
  ],
};
