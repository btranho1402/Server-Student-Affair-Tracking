const express = require('express');

const app = express();
const port = 3001; // You can use any port you prefer
const crypto = require('crypto');

const db = require('./database');


/*
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
*/

// Middleware to parse JSON requests
app.use(express.json());

// Route to get users
app.get('/get/users', (req, res) => {
    const userId = req.query.id; // Get the user's ID from the query parameter
    const sql = 'SELECT * FROM users WHERE ID = ?';
    connection.query(sql, [userId], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching user from database' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: 'User not found' });
        } else {
          res.json(results[0]);
        }
      }
    });
});
/*
app.get('/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const sql = 'select * from login where (username, password) = (?, ?)';
    var userid = -1;
    connection.query(sql, [username, password], (err, results) => {
        if(err) {
            res.status(500).json({error: 'Error fetching user from database'});
        } else {
            if(results.length === 0) {
                res.status(404).json({error: 'User not found' });
            } else {
                userid = results[0].ID;
                if (userid != -1)
                {
                    const newsql = 'select * from users where ID = ?';
                    connection.query(newsql, userid, (err, result) => {
                        if (err) {
                            res.status(500).json({error: 'Error fetching user from database'});
                        } else {
                            if(result.length === 0) {
                                res.status(404).json({error: 'User not found' });
                            } else {
                                res.status(200).json(result[0]);
                                insertToken(userid);
                            }
                        }
                    });
                }
            }
        }
    });
})
*/

app.get('/api/user', async (req, res) => {
    const userId = req.query.id;
    db.getuser(userId, (error, result) => {
        if (error) {
            res.status(500).json({ error: 'cannot find user' });
        } else if (result != null)
        {
            if (result.length === 0) {
                res.status(500).json({ error: "cannot find user"});
            } else {
                res.status(200).json(result[0]);
            }
        } 
    });
});


app.get('/login', async (req, res) => {
    const userName = req.query.username;
    const passWord = req.query.password;
    let userID = -1;
    db.userLogin(userName, passWord, (err, result) => {
        if(err) {
            res.status(500).json({ error: 'cannot login' });
        } else if (result != null) {
            if(result.length === 0) {
                res.status(500).json({ error : "cannot find user"});
            } else {
                res.status(200).json("you have login successfully");
                userID = result[0].id;
            }
        }
        if(userID != -1) {
            db.insertToken(userID, (err, result) => {
            });
        }
    });
});

// Route to create a new user
app.post('/createaccount', (req, res) => {
    const request = req.body;
    const newUser = [request.firstName, request.lastName, request.dob, request.phoneNumber, request.email];
    const newLogin = [request.username, request.password];
    db.createUser(newUser, newLogin, (err, result) => {
        if(err) {
            res.status(500).json({ error: 'cannot create new user' });
        } else {
            res.status(200).json({ message: "created account successfully"});
        }
    });
});

app.delete('/logout', (req, res) => {
    const userId  = req.query.id;
    db.logout(userId, (err, result) => {
        if(err) {
            res.status(500).json({ error: 'cannot logout' });
        } else {
            res.status(200).json({ message: "you have logouted successfully"});
        }
    })
});

app.delete('/deleteaccount', (req, res) => {
    const  userId  = req.body;
    db.deleteUser(userId, (err, result) => {
        if(err) {
            res.status(500).json({ error: 'cannot delete user' });
        } else {
            res.status(200).json({ message: "you  deleted your account successfully"});
        }
    })
   
});
  
// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


