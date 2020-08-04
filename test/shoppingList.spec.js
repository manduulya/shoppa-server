const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const { makeShoppingListsArray } = require("./shoppingList.fixtures");

describe("Shopping List router", function () {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());
  before("clean the table", () =>
    db.raw("TRUNCATE shoppa_shoppinglists RESTART IDENTITY CASCADE")
  );
  afterEach("cleanup", () =>
    db.raw("TRUNCATE shoppa_shoppinglists RESTART IDENTITY CASCADE")
  );

  describe(`GET /shoppinglists`, () => {
    context("Given no shopping list in the database", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app).get("/shoppinglists").expect(200, []);
      });
    });
    context("Given there are shopping list in the database", () => {
      const testShoppingList = makeShoppingListsArray();
      beforeEach("Insert shopping list", () => {
        return db.into("shoppa_shoppinglists").insert(testShoppingList);
      });
      it("responds with 200 and all of the shopping lists", () => {
        return supertest(app)
          .get("/shoppinglists")
          .expect(200, testShoppingList);
      });
    });
  });
  describe(`POST /shoppinglists`, () => {
    it("responds with 201 and the created folder", () => {
      const testShoppingLists = makeShoppingListsArray();
      return supertest(app)
        .post("/shoppinglists")
        .send(testShoppingLists[0])
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(testShoppingLists.title);
        });
    });
  });
});
