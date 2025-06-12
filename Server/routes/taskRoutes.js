const taskCtrl = require('../controllers/TaskController');
const authManager = require('../middleware/ManagerAuth');
const taskRouter = require('express').Router();
const auth = require('../middleware/AuthMiddleware');
const userCtrl = require('../controllers/UserController');



taskRouter.get('/get-tasks', auth, userCtrl.getTasks);
taskRouter.get('/get-assigned-tasks', authManager, taskCtrl.getAssignedTasks);
taskRouter.put('/update-task-status/:id', auth, taskCtrl.updateTaskProgress);
// taskRouter.post('/assign-to-team/:teamID', authManager, taskCtrl.assignTaskToTeam);
taskRouter.post('/create-and-assign-to-team/:teamID', authManager, taskCtrl.createAndAssignTask);
module.exports = taskRouter;