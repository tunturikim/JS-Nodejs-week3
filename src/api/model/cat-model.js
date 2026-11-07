// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../../utils/database.js';

const listAllCats = async () => {
    // owner = owner's user id, owner_name = owner's name
    const [rows] = await promisePool.query(
      `SELECT c.*, u.name AS owner_name
       FROM wsk_cats c LEFT JOIN wsk_users u ON c.owner = u.user_id`);
    console.log('rows', rows);
    return rows;
};

const findCatById = async (id) => {
    const [rows] = await promisePool.execute(
      `SELECT c.*, u.name AS owner_name
       FROM wsk_cats c LEFT JOIN wsk_users u ON c.owner = u.user_id
       WHERE c.cat_id = ?`, [id]);
    console.log('rows', rows);
     if (rows.length === 0) {
        return false;
     }
     return rows[0];
};

const listCatsByUserId = async (userId) => {
    const [rows] = await promisePool.execute(
      `SELECT c.*, u.name AS owner_name
       FROM wsk_cats c LEFT JOIN wsk_users u ON c.owner = u.user_id
       WHERE c.owner = ?`, [userId]);
    return rows;
};

const addCat = async (cat) => {
   const {cat_name, weight, owner, filename, birthdate} = cat;
   const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
   const params = [cat_name, weight, owner, filename, birthdate];
   const rows = await promisePool.execute(sql, params);
    console.log('rows', rows);
     if (rows[0].affectedRows === 0) {
        return false;
     }
    return {cat_id: rows[0].insertId};
};

// Admin can modify any cat, other users only their own (owner = user_id)
const modifyCatById = async (id, cat, user) => {
  let sql;
  if (user.role === 'admin') {
    sql = promisePool.format(`UPDATE wsk_cats SET ? WHERE cat_id = ?`, [cat, id]);
  } else {
    sql = promisePool.format(
      `UPDATE wsk_cats SET ? WHERE cat_id = ? AND owner = ?`,
      [cat, id, user.user_id],
    );
  }
    const rows = await promisePool.execute(sql);
    console.log('rows', rows);
     if (rows[0].affectedRows === 0) {
        return false;
     }
     return true;
};

const removeCatById = async (id, user) => {
    let sql = 'DELETE FROM wsk_cats WHERE cat_id = ?';
    const params = [id];
    if (user.role !== 'admin') {
      sql += ' AND owner = ?';
      params.push(user.user_id);
    }
    const [rows] = await promisePool.execute(sql, params);
    console.log('rows', rows);
     if (rows.affectedRows === 0) {
        return false;
     }
     return true;
};

export {listAllCats, listCatsByUserId, findCatById, addCat, modifyCatById, removeCatById};