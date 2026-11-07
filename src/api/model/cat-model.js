// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../../utils/database.js';

const listAllCats = async () => {
    // TODO: Liitä kyselyyn myös haku käyttäjätaulusta, jotta saadaan omistajan nimi mukaan. 
    // Tällä hetkellä palautetaan vain omistajan id.
    const [rows] = await promisePool.query('SELECT * FROM wsk_cats');
    console.log('rows', rows);
    return rows;
};

const findCatById = async (id) => {
    // TODO: Liitä kyselyyn myös haku käyttäjätaulusta, jotta saadaan omistajan nimi mukaan. 
    // Tällä hetkellä palautetaan vain omistajan id. korvaa usereiden id omistajan nimellä.
    const [rows] = await promisePool.execute('SELECT * FROM wsk_cats WHERE cat_id = ?', [id]);
    console.log('rows', rows);
     if (rows.length === 0) {
        return false;
     }
     return rows[0];
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

export {listAllCats, findCatById, addCat, modifyCatById, removeCatById};