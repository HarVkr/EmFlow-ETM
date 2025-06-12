const router = require('express').Router();
const ticketCtrl = require('../controllers/TicketController');
const auth = require('../middleware/AuthMiddleware');
const authManager = require('../middleware/ManagerAuth');

// Create and manage tickets
router.post('/create-ticket', auth, ticketCtrl.createTicket);
router.get('/my-tickets', auth, ticketCtrl.getMyTickets);
router.get('/assigned-tickets', auth, ticketCtrl.getAssignedTickets);
router.get('/all-tickets', auth, ticketCtrl.getAllTickets);
router.get('/statistics', auth, ticketCtrl.getTicketStatistics);
router.get('/team-members', auth, ticketCtrl.getTeamMembersForTickets);

// Individual ticket operations
router.get('/:ticketId', auth, ticketCtrl.getTicketDetails);
router.put('/:ticketId/status', auth, ticketCtrl.updateTicketStatus);
router.put('/:ticketId/assign', auth, ticketCtrl.assignTicket);
router.post('/:ticketId/response', auth, ticketCtrl.addResponse);


module.exports = router;