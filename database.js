const mysql = require('mysql2');
const crypto = require('crypto');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'KimNamjoon_1402',
    database: 'firstproject',
  });
  
  // Connect to the database
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to database');
    }
  });


function getuser(userId, callback) {
    connection.query("SELECT * from users where ID = ?", userId, (err, result) => {
        if (err) {
            console.log("cannot find user");
            callback(err, null);
        } else {
            console.log("success");
            callback(null, result);
        }
    });
}

function userLogin(userName, passWord, callback) {
    connection.query("SELECT * from login where (username, password) = (?, ?)", [userName, passWord], (err, result) => {
        if (err) {
            console.log("error to create new login");
            callback(err, null);
        } else {
            console.log("login successfully");
            callback(null, result);
        }
    });
}
function insertToken(userid, callback) {

    const token = generateToken();
    console.log(userid);
    console.log(token);

    connection.query('INSERT INTO tokens (user_id, token) VALUES (?, ?)', [userid, token], (err, result) => {
        if (err) {
            console.log('Error creating token' );
            callback(err, null);
        } else {
            console.log('Token created successfully');
            callback(null, result);
        }
      
    });
}

function generateToken() {
    const tokenLength = 32; // You can adjust the token length as needed
    return crypto.randomBytes(tokenLength).toString('hex');
}

function createUser(newUser, newLogin, callback) {
    connection.query('INSERT INTO users (first_name, last_name, date_of_birth, phone_number, email) VALUES (?, ?, ?, ?, ?)', newUser, (err, result) => {
        if(err) {
            console.log("error creating new user");
        } else {
            const lastInsertedId = result.insertId;
            const newUserInsert = [lastInsertedId, newUser[0], newUser[1]]
            console.log(newUserInsert);
            connection.query('insert into login (id, username, password) values (?, ?, ?)', newUserInsert, (error, res) => {
                if(error) {
                    console.log("error creating new login");
                    callback(err, null);
                } else {
                    console.log("new login successfully created");
                    callback(null, result);
                }
            });
        }
    })
}

function logout(userId, callback) {
    const sql = 'DELETE FROM tokens WHERE user_id = ?';
  
    connection.query(sql, [userId], (err, result) => {
      if (err) {
        console.log( 'Error logging out' );
        callback(err, null);
      } else {
        console.log('Logged out successfully');
        callback(null, result);
      }
    });
}

function deleteUser(userId, callback) {

    const userSql = 'DELETE FROM users WHERE ID = ?';
    connection.query(userSql, [userId], (err, result) => {
      if (err) {
        console.log('Error deleting user');
        callback(err, null);
      } else {
        console('User deleted successfully');
        callback(null, result);
      }
    });
}

module.exports = { getuser, userLogin, createUser, insertToken, logout, deleteUser};