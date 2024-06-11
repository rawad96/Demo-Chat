const express = require('express')
const GroupDbBLL = require('../BLL/groupsBll')


const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const groups = await GroupDbBLL.getAllGroups();
        res.send(groups);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const group = await GroupDbBLL.getGroupById(id);
        res.send(group);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const obj = req.body;
        const result = await GroupDbBLL.addGroup(obj);
        return res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const obj = req.body;
        const result = await GroupDbBLL.updateGroup(id, obj);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await GroupDbBLL.deleteGroup(id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;





