const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const { makeNewStores } = require("./stores.fixtures");

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
    db.raw("TRUNCATE shoppa_stores RESTART IDENTITY CASCADE")
  );
  afterEach("cleanup", () =>
    db.raw("TRUNCATE shoppa_stores RESTART IDENTITY CASCADE")
  );
  describe(`GET /stores`, () => {
    context("Given no store in the database", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app).get("/stores").expect(200, []);
      });
    });
    context("Given there are stores in the database", () => {
      const testStore = makeNewStores();
      beforeEach("Insert store", () => {
        return db.into("shoppa_stores").insert(testStore);
      });
      it("responds with 200 and all of the stores", () => {
        return supertest(app).get("/stores").expect(200, testStore);
      });
    });
  });
});
