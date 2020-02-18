const express = require("express");
const User = require("../models/user");
const Message = require("../models/message");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        if (User.authenticate(username, password)) {
            User.updateLoginTimestamp(username);
            let token = jwt.sign({ username }, SECRET_KEY);
            return res.json({ token });
        }
        throw new ExpressError("Invalid credentials, 401");
    } catch (err) {
        return next();
    }
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async function (req, res, next) {
    try {
        user = User.register(req.body)
        if (user) {
            let token = jwt.sign({ username }, SECRET_KEY);
            return res.json({ token });
        }
    } catch (err) {
        return next();
    }
})