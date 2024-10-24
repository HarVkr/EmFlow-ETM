const router = require('express').Router();
const teamCtrl = require('../controllers/TeamController');
const authManager = require('../middleware/ManagerAuth');
const authAdmin = require('../middleware/AdminAuth');
const auth = require('../middleware/AuthMiddleware');

router.get('/:teamID', auth, teamCtrl.getTeamDetails);
router.get('/:teamID/get-tasks', auth, teamCtrl.getTeamTasks);
router.post('/create-team', authAdmin, teamCtrl.createTeam);
router.post('/add-team-members', authAdmin, teamCtrl.addMemberstoTeam);

module.exports = router;