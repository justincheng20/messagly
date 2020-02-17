/** User class for message.ly */
const db = require("../db")
const ExpressError = require("../expressError");
const bycrpt = require('bcrypt')
const {BCRYPT_WORK_FACTOR} = require('../config')


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPassword = await bycrpt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at) 
      VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
      RETURNING username, password, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]);
      
    return result.rows[0]; 
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { 
    const result = await db.query(`
      SELECT password 
      FROM users 
      WHERE username = $1`, 
      [username]);
    const user = result.rows[0];
    let isValid = await bycrpt.compare(password, user.password);
    if (user && isValid){
      return true;
    }
    return false;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    const result = await db.query(
        `UPDATE users
        SET last_login_at = current_timestamp
        WHERE username = $1
        RETURNING username`,
        [username]);
    return result.rows;
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone FROM users`);
    return result.rows;
    
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
    const result = await db.query(
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
    if (!result.rows[0]) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }
    return result.rows[0]
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const result = await db.query(
      `SELECT id, 
      username, 
      first_name, 
      last_name, 
      phone, 
      body, 
      sent_at, 
      read_at 
      FROM users
      JOIN messages
      ON to_username = username
      WHERE from_username = $1`,
      [username]
    )
    console.log(result.rows)
    let messages = result.rows.map(m => {
      return {
        id: m.id, 
        to_user: {username: m.username, 
                first_name: m.first_name, 
                last_name: m.last_name,
                phone: m.phone},
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at
      }
    })
    return messages
  }


  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { 
    const result = await db.query(
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
      ON username = from_username
      WHERE to_username = $1`,
      [username]
    )

    let messages = result.rows.map(m => {
      return {
        id: m.id, 
        from_user: {username: m.username, 
                first_name: m.first_name, 
                last_name: m.last_name,
                phone: m.phone},
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at
      }
    })
    return messages
  }
}


module.exports = User;