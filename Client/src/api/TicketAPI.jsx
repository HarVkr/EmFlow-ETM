import api from '../utils/axios';

const TicketAPI = (token) => {
    const createTicket = async (ticketData) => {
        try {
            console.log("Creating ticket...");
            const res = await api.post('/tickets/create-ticket', ticketData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error creating ticket: ", err);
            return null;
        }
    };
    const getTeamMembersForTickets = async () => {
        try {
            console.log("Getting team members for tickets...");
            const res = await api.get('/tickets/team-members', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error getting team members for tickets: ", err);
            return [];
        }
    };
    const getMyTickets = async () => {
        try {
            const res = await api.get('/tickets/my-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error getting my tickets: ", err);
            return null;
        }
    };

    const getAssignedTickets = async () => {
        try {
            const res = await api.get('/tickets/assigned-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error getting assigned tickets: ", err);
            return null;
        }
    };

    const getAllTickets = async () => {
        try {
            const res = await api.get('/tickets/all-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error getting all tickets: ", err);
            return null;
        }
    };

    const getTicketDetails = async (ticketId) => {
        try {
            const res = await api.get(`/tickets/${ticketId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error getting ticket details: ", err);
            return null;
        }
    };

    const updateTicketStatus = async (ticketId, status) => {
        try {
            const res = await api.put(`/tickets/${ticketId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error updating ticket status: ", err);
            return null;
        }
    };

    const assignTicket = async (ticketId, assignedTo) => {
        try {
            const res = await api.put(`/tickets/${ticketId}/assign`, { assignedTo }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error assigning ticket: ", err);
            return null;
        }
    };

    const addResponse = async (ticketId, responseData) => {
        try {
            const res = await api.post(`/tickets/${ticketId}/response`, responseData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error adding response: ", err);
            return null;
        }
    };

    const getTicketStatistics = async () => {
        try {
            const res = await api.get('/tickets/statistics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error getting ticket statistics: ", err);
            return null;
        }
    };

    return {
        createTicket,
        getMyTickets,
        getAssignedTickets,
        getAllTickets,
        getTicketDetails,
        updateTicketStatus,
        assignTicket,
        addResponse,
        getTicketStatistics,
        getTeamMembersForTickets
    };
};

export default TicketAPI;