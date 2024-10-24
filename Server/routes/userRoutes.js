const userCtrl = require('../controllers/UserController');
const authAdmin = require('../middleware/AdminAuth');
const router = require('express').Router();
const auth = require('../middleware/AuthMiddleware');
const authManager = require('../middleware/ManagerAuth');
const taskCtrl = require('../controllers/TaskController');

router.post('/login', userCtrl.login);
router.post('/logout', userCtrl.logout);
router.get('/refresh_token', userCtrl.refreshtoken);
router.post('/create-employee', authAdmin, userCtrl.createEmployee);
router.put('/delete-employee/:id', authAdmin, userCtrl.deleteEmployee);
router.get('/get-user', auth, userCtrl.getUser);
router.get('/get-employee/:id', auth, userCtrl.getEmployeeDatabyID);
router.post('/get-employee-by-name', auth, userCtrl.getEmployeeIDsbyName);
router.get('/get-tasks', auth || authManager, userCtrl.getTasks);
router.put('/edit-role/:id', authAdmin, userCtrl.editRole);
router.post('/get-employee-userid', authManager, userCtrl.getEmployeeNamebyID);
module.exports = router;