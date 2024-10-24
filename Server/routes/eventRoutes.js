const eventCtrl = require('../controllers/EventController');
const authManager = require('../middleware/ManagerAuth');
const router = require('express').Router();
const auth = require('../middleware/AuthMiddleware');

router.post('/create-event', authManager, eventCtrl.createEvent);
router.get('/get-events', auth, eventCtrl.getEvents);


module.exports = router;