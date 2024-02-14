const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser")

const jwt_secret = "mohammedsahilkhan@1stnode";
//ROUTE 1
//creating a new user
router.post(
    "/createuser",
    [
        body("name", "Enter a valid name").isLength({ min: 3 }),
        body("email", "Enter a valid Email").isEmail(),
        body("password", "password must be min. 5 chars.").isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res
                    .status(400)
                    .json({ error: "Sorry, a user with this email already exists." });
            }
            const salt = await bcrypt.genSalt(10);
            secured_password = await bcrypt.hash(req.body.password, salt);

            //user creation
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secured_password,
            });
            //   .then(user => res.json(user)).catch(err=> {console.log(err)
            //     res.json({error:'Email already used. please enter another one'})})
            const data = {
                user: {
                    id: user.id,
                    mail: user.email
                }
            };
            const authtoken = jwt.sign(data, jwt_secret);

            res.json({ authtoken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);
//ROUTE 2
// Authenticate the user

router.post(
    "/login",
    [
        body("email", "Enter a valid Email").isEmail(),
        body("password", "Password cannot be blank").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {email, password } = req.body;
        try {
            let user = await User.findOne({email});
            if (!user) {
                return res
                    .status(400)
                    .json({ error: "login with correct credentials" });
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res
                    .status(400)
                    .json({ error: "login with correct credentials" });
            }
            const data = {
                user: {
                    id: user.id,
                    mail: user.email
                }
            };
            const authtoken = jwt.sign(data, jwt_secret);

            res.json({ authtoken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);
//ROUTE 3
// get user details for user login login required
router.post(
    "/getuser",fetchuser, async (req, res) => {
        try {
            userid = req.user.id
            const user = await User.findById(userid).select('-password')
            res.send(user)

            
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }

    })


module.exports = router;
