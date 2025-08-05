const Task = require("../models/task");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/", async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).send({ message: "Task not found" });
        }
        await task.update(req.body);
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).send({ message: "Task not found" });
        }
        await task.destroy();
        res.send({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
