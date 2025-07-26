const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/project/:projectId', taskController.getTasksByProject);
router.post('/project/:projectId', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;