const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const router = express.Router();

router.get("/", (req, res) => {
  const token = req.headers["xaccesstoken"];

  if (!token) {
    res.status(401).send("No TokenProvided");
  }

  const ACCESS_SECRET_TOKEN = process.env.JWT_KEY;
  jwt.verify(token, ACCESS_SECRET_TOKEN, (err, data) => {
    if (err) {
      res.status(500).send("Faild to authenticate token");
    }
    res.send({ id: data.id, resp: true });
  });
});

module.exports = router;
