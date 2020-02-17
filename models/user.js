/** User class for message.ly */
const db = require("../db")


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const results = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, phone) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING (username, password, first_name, last_name)`),
      [username, password, first_name, last_name, phone];
    return results.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results = await db.query(
      `SELECT username, first_name, last_name, phone FROM users`);
    return results.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const results = await db.query(
      `SELECT username, 
            first_name, 
            last_name, 
            phone, 
            join_at, 
            last_login_at 
            FROM users 
            WHERE username = $1`,
      [username]
    );
    return results.rows[0]
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const results = await db.query(
      `SELECT id, 
      username, 
      first_name, 
      last_name, 
      phone, 
      body, 
      sent_at, 
      read_at 
      FROM messages
      JOIN users
      ON username = from_username`
    )
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
}


module.exports = User;