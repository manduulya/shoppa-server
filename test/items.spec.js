const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const { makeNewItem } = require("./item.fixtures");

describe("Items router", function () {
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
    db.raw("TRUNCATE shoppa_items RESTART IDENTITY CASCADE")
  );
  afterEach("cleanup", () =>
    db.raw("TRUNCATE shoppa_items RESTART IDENTITY CASCADE")
  );
  describe(`GET /items`, () => {
    context("Given no item in the database", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app).get("/items").expect(200, []);
      });
    });
    context("Given there are item in the database", () => {
      const testItem = makeNewItem();
      beforeEach("Insert item", () => {
        return db.into("shoppa_items").insert(testItem);
      });
      it("responds with 200 and all of the stores", () => {
        return supertest(app).get("/items").expect(200, testItem);
      });
    });
  });
});
