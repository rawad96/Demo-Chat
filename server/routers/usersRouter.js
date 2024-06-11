const express = require('express')
const UsersDbBLL = require('../BLL/usersBLL')

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const users = await UsersDbBLL.getAllUsers();
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UsersDbBLL.getUserById(id)
        res.send({ _id: user._id, name: user.name, conversations: user.conversations, blocked: user.blocked, groups: user.groups });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const obj = req.body;
        const result = await UsersDbBLL.addUser(obj);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const obj = req.body;
        const result = await UsersDbBLL.updateUser(id, obj);
        return res.json(result);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await UsersDbBLL.deleteUser(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;