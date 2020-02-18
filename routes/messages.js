const express = require("express");
const Message = require("../models/message");
const router = new express.Router();
const {ensureLoggedIn} = require("../middleware/auth")

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", async function (req, res, next) {
    try {
        const message = Message.get(id)
        return jsonify({message})
    } catch (err) {
      return next(err);
    }
  });


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", async function (req, res, next) {
    try {
        const {to_username, body} = req.body
        // get from_username from local storage
        message = Message.create(from_username, to_username, body)
        return jsonify ({message})
    } catch (err) {
      return next(err);
    }
  });


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureLoggedIn, async function (req, res, next) {
    try {
        // authenticate
        message = Message.markRead(id)
        return jsonify ({message})
    } catch (err) {
      return next(err);
    }
  });


