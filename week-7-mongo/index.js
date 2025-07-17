const express = require("express");
const mongoose = require("mongoose");
const {UserModel, TodoModel} = require("./db");
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'dhruv4real';

mongoose.connect('mongodb+srv://techdhruvspace:TRShNeY4CDJuAbTD@cluster0.yvmz5on.mongodb.net/todo-project')
const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const user = await UserModel.create({
        email: email,
        password: password,
        name: name
    })
    res.json({
        message: "User Created Successfully, Login to enter"
    })
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email,
        password: password
    })

    if (user) {
        const token = jwt.sign({
            email
        }, JWT_SECRET);
        res.json({
            token: token
        })
     } else {
            res.status(403).json({
                message: "Incorrect Credentials"
            })
        };
    
});

function auth(req, res, next) {
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);

    if(decodedData) {
        req.email = decodedData.email;
        next();
    } else {
        res.status(403).json({
            message: "incorrect Credentials"
        })
    }
}

app.post('/todo', auth, (req, res) => {
    const email = req.email;
    res.json({email})
});

app.get('/todos', auth, (req, res) => {
    const email = req.email;
    res.json({email})
});

app.listen(3000, () => {
    console.log("Running at port 3000")
});