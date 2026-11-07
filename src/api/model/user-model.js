import promisePool from '../../utils/database.js';

const listAllUsers = async () => {
    const [rows] = await promisePool.query('SELECT * FROM wsk_users');
    console.log('rows', rows);
    return rows;
};

const findUserById = async (id) => {
    const [rows] = await promisePool.execute('SELECT * FROM wsk_users WHERE user_id = ?', [id]);
    console.log('rows', rows);
     if (rows.length === 0) {
        return false;
     }
     return rows[0];
};

const addUser = async (user) => {
  const {name, username, email, password, role} = user;
  const sql = `INSERT INTO wsk_users (name, username, email, password, role) 
                VALUES (?, ?, ?, ?, ?)`;
  const params = [name, username, email, password, role];
  const rows = await promisePool.execute(sql, params);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
      return false;
    }
    return {user_id: rows[0].insertId};
};

const modifyUserById = async (id, user) => {
  const sql = promisePool.format(`UPDATE wsk_users SET ? WHERE user_id = ?`, [user, id]);
    const rows = await promisePool.execute(sql);
    console.log('rows', rows);
     if (rows[0].affectedRows === 0) {
        return false;
     }
     return true;
};

// Deletes the user and the user's cats in one transaction:
// either both succeed or nothing is deleted
const removeUserById = async (id) => {
    const connection = await promisePool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);
      const [rows] = await connection.execute('DELETE FROM wsk_users WHERE user_id = ?', [id]);
      await connection.commit();
      return rows.affectedRows !== 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
};

export {listAllUsers, findUserById, addUser, modifyUserById, removeUserById};