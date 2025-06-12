const router = require('express').Router();
const teamCtrl = require('../controllers/TeamController');
const authManager = require('../middleware/ManagerAuth');
const authAdmin = require('../middleware/AdminAuth');
const auth = require('../middleware/AuthMiddleware');

// Get team information
router.get('/manager-teams', authManager, teamCtrl.getManagerTeams);
router.get('/list-teams', authAdmin, teamCtrl.listAllTeams);
router.get('/my-team', auth, teamCtrl.getUserTeam);
router.post('/create-team', authManager, teamCtrl.createTeam);
router.post('/add-team-members', authManager, teamCtrl.addMemberstoTeam);
router.post('/remove-team-members', authManager, teamCtrl.removeTeamMembers);

// Team-specific operations with parameters (these should come AFTER specific routes)
router.get('/:teamID', auth, teamCtrl.getTeamDetails);
router.get('/:teamID/get-tasks', auth, teamCtrl.getTeamTasks);
router.put('/update-team-name/:teamID', authManager, teamCtrl.updateTeamName);
// router.post('/:teamID/assign-task', authManager, teamCtrl.assignTaskToTeam);
router.get('/:teamID/performance', authManager, teamCtrl.getTeamPerformance);
router.get('/:teamID/members', auth, teamCtrl.getTeamMembers);

module.exports = router;