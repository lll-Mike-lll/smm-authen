var express = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');
const cookieParser = require("cookie-parser");

const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))
    // mydb = mysql.connector.connect(
    //     host="us-cdbr-east-04.cleardb.com",
    //     user="b7b73786368250",
    //     password="a5cb0d1d",
    //     database="heroku_167ea041d1b799b"
    //   )

var mysql = require("mysql")
    // var con = mysql.createConnection({
    //         host: "us-cdbr-east-04.cleardb.com",
    //         user: "b7b73786368250",
    //         password: "a5cb0d1d",
    //         database: "heroku_167ea041d1b799b",

//     })
// `This is ${soMany} times easier!`

// app.get('/test', function(req, res) {
//     console.log(req.query)
//     res.send(req.query)
// })

app.get("/get_cookie", (req, res) => {
    let token = req.cookies.token_cookie;
    console.log(token)
    res.send(token)
})


app.get('/register', function(req, res) {
    res.render("register")
})

app.get('/login', function(req, res) {
    res.render("login")
})

app.get('/cookie', function(req, res) {
    res.cookie(`Cookie_set_login`, `keep_in_cookie`);
    console.log('keep_cookie')
    res.send('keep_cookie')
})


app.post('/test_post', function(req, res) {
    // res.cookie(`Cookie_set_login`, `keep_in_cookie`);
    console.log('test_post worked')
    console.log(req.body)
    res.send("user: " + req.body.username)
})

app.post('/test_adduser', function(req, res) {
    // res.cookie(`Cookie_set_login`, `keep_in_cookie`);
    console.log('test_adduser worked')
    console.log(req.body)
        // res.send("user: " + req.body.username + " " + req.body.token)

    var con = mysql.createPool({
        host: process.env.MYSQL_host,
        user: process.env.MYSQL_user,
        password: process.env.MYSQL_password,
        database: process.env.MYSQL_database,
    })

    username = req.body.username
    password = req.body.password
    email = req.body.email
    token = req.body.token

    sql1 = `select * 
    from heroku_167ea041d1b799b.master_authen 
    where username = '${username}'
    and password = '${password}'`

    sql2 = `INSERT INTO heroku_167ea041d1b799b.master_authen 
    (username, password, email, token) 
    VALUES ('${username}', '${password}', '${email}','${token}');`

    try {
        con.getConnection(function(err, connection) {
            if (err) throw err; // not connected!

            // Use the connection
            console.log('connected')
            connection.query(sql2, function(error, results) {
                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if (error) {
                    console.log('sql_err')
                    console.log(error)
                    res.send(error)
                };

                // Don't use the connection here, it has been returned to the pool.
            });
        });
    } catch (err) {
        console.log('catch_err')
        console.log(err)
    }




})


app.post('/get_user', function(req, res) {
    // res.cookie(`Cookie_set_login`, `keep_in_cookie`);
    console.log('test_get_user worked')
    console.log(req.body)
        // res.send("user: " + req.body.username + " " + req.body.token)

    var con = mysql.createConnection({
        host: "us-cdbr-east-04.cleardb.com",
        user: "b7b73786368250",
        password: "a5cb0d1d",
        database: "heroku_167ea041d1b799b",
    })

    token = req.body.token


    con.connect(function(err) {
        if (err) {
            throw err
        }
        console.log("connect")
        var sql1 = `select * 
        from heroku_167ea041d1b799b.master_authen 
        where token = '${token}'`
        con.query(sql1, function(err, result) {
            if (err) {
                throw err
            }
            console.log(result)
            res.send(result[0])
            con.end(function(err) {
                if (err) {
                    return console.log('error:' + err.message);
                    res.send(err.message)
                }
                console.log('Close the database connection.');
            });
        })
    })
})

///////////////////////////////////////////////////////////////////////////////////////////

app.post('/test_login', function(req, res) {

    var con = mysql.createPool({
        host: "us-cdbr-east-04.cleardb.com",
        user: "b7b73786368250",
        password: "a5cb0d1d",
        database: "heroku_167ea041d1b799b"
    })

    let username = req.body.username
    let password = req.body.password
    let token = req.body.token


    con.getConnection(function(err, conn) {
        if (err) {
            res.send(err)
            throw err
        }
        console.log("connect")
        var sql1 = `select * 
        from heroku_167ea041d1b799b.master_authen 
        where username = '${username}'
        and password = '${password}'`

        conn.query(sql1, function(err, results) {
            if (err) {
                res.send(err)
                throw err
            }
            console.log('finished sql1 ')
            console.log(results)

            if (results[0]) {
                console.log(results[0].username)
                var sql2 = `UPDATE heroku_167ea041d1b799b.master_authen 
                SET token = '${token}' 
                WHERE username = '${results[0].username}'`
                console.log(sql2)

                conn.query(sql2, function(err2, results2) {
                    console.log('finished sql2')
                    console.log(results2)
                    res.send({
                        'token': token
                    })
                })
            } else {
                res.send('cannot login')
            }

        })

        // con.end(function(err) {
        //     if (err) {
        //         return console.log('error:' + err.message);
        //         res.send(err.message)
        //     }
        //     console.log('Close the database connection.');
        // });
    })
})


app.get('/test_multi', function(req, res) {

    var con = mysql.createConnection({
        host: "us-cdbr-east-04.cleardb.com",
        user: "b7b73786368250",
        password: "a5cb0d1d",
        database: "heroku_167ea041d1b799b",
        multipleStatements: true
    })

    // username = req.body.username
    // password = req.body.password
    // email = req.body.email
    // token = req.body.token


    con.connect(function(err) {
        if (err) {
            throw err
        }
        console.log("connect")
        var sql1 = `select * from heroku_167ea041d1b799b.master_authen where username = 'mike'`
        var sql2 = `select * from heroku_167ea041d1b799b.master_authen where username = 'admin'`
        var all_sql = sql1 + ";" + sql2
        con.query(all_sql, function(err, results) {
            if (err) {
                throw err
            }
            console.log(results[0]); // [{1: 1}]
            console.log(results[1]); // [{2: 2}]
            res.send('success')
            con.end(function(err) {
                if (err) {
                    return console.log('error:' + err.message);
                    res.send(err.message)
                }
                console.log('Close the database connection.');
            });
        })
    })
})


app.get('/test_multi2', function(req, res) {

    var con = mysql.createPool({
        host: "us-cdbr-east-04.cleardb.com",
        user: "b7b73786368250",
        password: "a5cb0d1d",
        database: "heroku_167ea041d1b799b"
    })

    // username = req.body.username
    // password = req.body.password
    // email = req.body.email
    // token = req.body.token


    con.getConnection(function(err, conn) {
        if (err) {
            res.send(err)
            throw err
        }
        console.log("connect")
        var sql1 = `select * 
        from heroku_167ea041d1b799b.master_authen 
        where username = 'mike'`

        conn.query(sql1, function(err, results) {
            if (err) {
                res.send(err)
                throw err
            }
            console.log('finished sql1 ')
            console.log(results)
            var sql2 = `select * 
            from heroku_167ea041d1b799b.master_authen 
            where username = 'admin'`
            console.log(sql2)

            conn.query(sql2, function(err2, results2) {
                console.log('finished sql2')
                console.log(results2)
                res.send('success multi2')
            })
        })

        // con.end(function(err) {
        //     if (err) {
        //         return console.log('error:' + err.message);
        //         res.send(err.message)
        //     }
        //     console.log('Close the database connection.');
        // });
    })
})


app.post('/add', function(req, res) {

    var con = mysql.createConnection({
        host: "us-cdbr-east-04.cleardb.com",
        user: "b7b73786368250",
        password: "a5cb0d1d",
        database: "heroku_167ea041d1b799b",
    })

    username = req.body.username
    password = req.body.password
    email = req.body.email
        // sql = `INSERT INTO heroku_167ea041d1b799b.authen_user (username, password, email) VALUES ("${username}", "${password}", "${email}")`
        // console.log(sql)
        // res.send('ok')

    con.connect(function(err) {
        if (err) {
            throw err
        }
        console.log("connect")
        sql = `INSERT INTO heroku_167ea041d1b799b.authen_user (username, password, email) VALUES ("${username}", "${password}", "${email}");`
        con.query(sql, function(err, result) {
            if (err) {
                throw err
            }
            console.log(result)
            res.render('register')
            con.end(function(err) {
                if (err) {
                    return console.log('error:' + err.message);
                }
                console.log('Close the database connection.');
            });
        })
    })
});

app.post('/test_return', function(req, res) {
    const get_name = req.body.name
    res.send({ get_name: { 'token': '123abc' } })
})

app.post('/check', function(req, res) {
    var con = mysql.createConnection({
        host: "us-cdbr-east-04.cleardb.com",
        user: "b7b73786368250",
        password: "a5cb0d1d",
        database: "heroku_167ea041d1b799b",
    })

    username = req.body.username
    password = req.body.password

    con.connect(function(err) {
        if (err) {
            throw err
        }
        console.log("connect")
        sql = `select * from heroku_167ea041d1b799b.authen_user where username = "${username}" and password = "${password}";`
        con.query(sql, function(err, result) {
            if (err) {
                throw err
            }
            try {
                if (result[0].username === username || result[0].password === password) {
                    console.log("Ok")
                    res.redirect("http://localhost:3000/?setname=" + username);
                } else {
                    console.log("wrong")
                    res.redirect('/login')
                }
            } catch (error) {
                // console.log(error)
                res.send('error')
            }

            con.end(function(err) {
                if (err) {
                    return console.log('error:' + err.message);
                }
                console.log('Close the database connection.');
            });
        })
    })
});


app.get('/', function(req, res) {
    var con = mysql.createConnection({
        host: "us-cdbr-east-04.cleardb.com",
        user: "b7b73786368250",
        password: "a5cb0d1d",
        database: "heroku_167ea041d1b799b",
    })

    con.connect(function(err) {
        if (err) {
            throw err
        }
        console.log("connect")
        sql = "select * from heroku_167ea041d1b799b.authen_user"
        con.query(sql, function(err, result) {
            if (err) {
                throw err
            }
            console.log(typeof result)
            console.log(result[1].email)
            res.send(result)
            con.end(function(err) {
                if (err) {
                    return console.log('error:' + err.message);
                }
                console.log('Close the database connection.');
            });
        })
    })
});


var server = app.listen(5048, function() {
    console.log('Server is running.. http://localhost:5048');
});