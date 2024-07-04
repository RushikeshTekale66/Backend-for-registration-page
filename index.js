const express = require('express');
const bcryptjs = require('bcryptjs');
const JWT = require('jsonwebtoken');
const cors = require('cors');
require("./DB/connect")
const Users = require("./Models/user");

const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;

app.get("/", async(req, res) => {
    const result = await Users.find({});
    res.send(result);
})

// Register
app.post(('/api/register'), async (req, res, next) => {
    try {
        const { fullName, email, password, dob } = req.body;

        if (!fullName || !email || !password || !dob) {
            res.status(400).send("Please fill all required fields");
        }
        else {
            const isAlreadExist = await Users.findOne({ email });
            if (isAlreadExist) {
                res.status(400).send("User already exist");
            }
            else {
                const newUser = new Users({ fullName, email, dob });
                bcryptjs.hash(password, 10, (err, hashedPassword) => {
                    newUser.set('password', hashedPassword);
                    newUser.save();
                    next();
                });
                return res.status(200).json({user: {email: user.email, fullName: user.fullName, dob: user.dob, id: user._id }, token: token});
            }
        }
    }
    catch (err) { }
})

// Login to application
app.post('/api/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).send("Please fill all required fields");
        }
        else {
            const user = await Users.findOne({ email });
            if (!user) {
                res.status(400).send("User not exits");
            }
            else {
                const validateUser = await bcryptjs.compare(password, user.password);
                if (!validateUser) {
                    res.status(400).send("User email or password is incorrect");
                }
                else {
                    const payload = {
                        userId: user.id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "scretkey";
                    JWT.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                        await Users.updateOne({ _id: user._id }, {
                            $set: { token }
                        });
                        user.save();
                        return res.status(200).json({ user: { email: user.email, fullName: user.fullName, dob: user.dob, id: user._id }, token: token });

                    })


                }
            }
        }
    }
    catch (e) { console.log(e) };
})

// search
app.get('/search/:key', async (req, res) => {
    let result = await Users.find({
        "$or": [
            { fullName: { $regex: req.params.key } },
            { email: { $regex: req.params.key } },
        ]
    })
    res.send(result);
})



app.listen(port, () => console.log("App is live"));