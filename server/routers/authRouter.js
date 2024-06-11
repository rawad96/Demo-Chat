const express = require("express");
const jwt = require("jsonwebtoken");
const usersdb = require("../BLL/usersBLL");
const dotenv = require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const users = await usersdb.getAllUsers();
  users.map((user) => {
    if (user.username === username && user.password === password) {
      const userId = user._id;
      const ACCESS_SECRET_TOKEN = process.env.JWT_KEY;

      const accessToken = jwt.sign({ id: userId }, ACCESS_SECRET_TOKEN);

      return res.send({ accessToken });
    }
  });
  res.status(401);
});

module.exports = router;
