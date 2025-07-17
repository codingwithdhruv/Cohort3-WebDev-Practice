const express = require('express');
const jwt = require("jsonwebtoken");
const JWT_SECRET = "davidji"

const app = express();

app.use(express.json());
const users = [];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

function auth(req, res, next) {
    try {
      const token = req.headers.token;
      const decodedInformation = jwt.verify(token, JWT_SECRET);
      const username = decodedInformation.username;

      const user = users.find((user) => user.username === username);
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).send({
          message: "Unauthorised",
        });
      }
    } catch (e) {
      res.status(401).send({
        message: "Invalid or expired token",
      });
    }
}

app.post('/signup', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if(users.find(u => u.username === username)){
        res.json({
            message: "Account with this username already exists"
        });
        return;
    }

    users.push({
        username: username,
        password: password
    })
    res.json({
        message: "You are signed in"
    })
});

app.post('/signin', function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find(function(u) {
       return (u.username === username && u.password === password) 
    })

    if(user) {
        const token = jwt.sign({
            username: user.username
        }, JWT_SECRET);
        console.log(`User signed in: ${username}`);
        res.json({
            message: "SignIn Successful",
            token: token
        });
    } else {
        console.log(`Invalid username: ${username} or password: ${password}`);
        res.status(401).json({
            message: "Invalid username or password"
        })
    }
});

app.get("/me", auth, (req, res) => {
    res.json({
        message: "You are at /me route",
        username: req.user.username
    })
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});