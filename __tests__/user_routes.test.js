const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");


describe("Test User class", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM messages");
        await db.query("DELETE FROM users");
        let u = await User.register({
            username: "test",
            password: "password",
            first_name: "Test",
            last_name: "Testy",
            phone: "+14155550000",
        });
    });

    describe("GET /", function () {
        test("can get all users", async function () {
            let response = await request(app)
                .post("/auth/login")
                .send({ username: "test", password: "password" });
            console.log("resp:",response.body)
            resp = await request(app).get("/users/").send({_token: response.body.token});
            expect(resp.body).toEqual({users:[{
                username: "test",
                first_name: "Test",
                last_name: "Testy",
                phone: "+14155550000"
            }]})

        })
    })



});

afterAll(async function () {
    await db.end();
});