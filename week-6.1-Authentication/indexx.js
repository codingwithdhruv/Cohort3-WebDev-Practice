const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET="Hello";


const app = express();
app.use(express.json());
const users = [];
app.get('/', (req, res) => {
    res.send({
        message: "Hello, this is root page"
    })
});

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(users.find(u=>u.username === username)){
        res.status(401).send({
            message: "User already exists"
        })
        } else {
            users.push({username, password});
            res.status(200).send({
                message: "User created successfully"
            })
        }
    })

app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find(u => u.username === username && u.password === password);
    if(user){
        const token = jwt.sign({
            username
        }, JWT_SECRET);
        res.status(200).send({
            message: 'Your JWT Token is:',
            token: token
        })
    } else {
        res.status(401).send({
            message: "Failed to generate a JWT"
        })
    }
})

app.get('/me', (req, res) => {
    try {
        const token = req.headers.token;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const username = decodedToken.username;
        const user = users.find(u => u.username === username);
        if(user) {
            res.status(200).send({
                message: "User authorized via JWT"
            })
        } else {
            res.status(401).send({
                message: "JWT Expired or Unauthorised"
            })
        }
    } catch (error) {
        res.status(401).send({
            message: "User Needs to login"
        })
    }
})

app.listen(3000, (req, res) => {
    console.log("Server is up on 3000")
});


"notion.so/web-dev-cohort-5995f81766e743a7818f188ce19ed50"