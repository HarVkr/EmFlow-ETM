import React, { useState, useContext, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Ticket, AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobalState } from '../../GlobalState';
import TicketAPI from '@/api/TicketAPI';
import CreateTicketForm from './subcomponents/CreateTicketForm';
import TicketCard from './subcomponents/TicketCard';
import TicketDetailsModal from './subcomponents/TicketDetailsModal';
import TicketStatistics from './subcomponents/TicketStatistics';
import UpdateTickets from './subcomponents/updateTickets';

const TicketManagement = () => {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [role] = state.role;
    
    const [tickets, setTickets] = useState([]);
    const [myTickets, setMyTickets] = useState([]);
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);

    const { 
        getAllTickets, 
        getMyTickets, 
        getAssignedTickets, 
        createTicket,
        updateTicketStatus,
        assignTicket,
        addResponse 
    } = useMemo(() => TicketAPI(token), [token]);

    // Fetch tickets on component mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [allTicketsData, myTicketsData, assignedTicketsData] = await Promise.all([
                getAllTickets(),
                getMyTickets(),
                getAssignedTickets()
            ]);

            setTickets(allTicketsData || []);
            setMyTickets(myTicketsData || []);
            setAssignedTickets(assignedTicketsData || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (ticketData) => {
        const result = await createTicket(ticketData);
        if (result) {
            await fetchAllData();
            setIsCreateModalOpen(false);
        }
    };

    const handleTicketClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsDetailsModalOpen(true);
    };

    const handleStatusUpdate = async (ticketId, newStatus) => {
        const result = await updateTicketStatus(ticketId, newStatus);
        if (result) {
            await fetchAllData();
        }
    };

    const handleAssignTicket = async (ticketId, assigneeId) => {
        const result = await assignTicket(ticketId, assigneeId);
        if (result) {
            await fetchAllData();
        }
    };

    const handleAddResponse = async (ticketId, responseData) => {
        const result = await addResponse(ticketId, responseData);
        if (result) {
            await fetchAllData();
            // Refresh ticket details if modal is open
            if (selectedTicket && selectedTicket._id === ticketId) {
                const updatedTickets = tickets.map(t => 
                    t._id === ticketId ? { ...t, responses: [...(t.responses || []), result.response] } : t
                );
                setTickets(updatedTickets);
            }
        }
    };

    // Filter tickets based on search and filters
    const getFilteredTickets = (ticketList) => {
        return ticketList.filter(ticket => {
            const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
            const matchesCategory = filterCategory === 'all' || ticket.category === filterCategory;
            
            return matchesSearch && matchesStatus && matchesCategory;
        });
    };

    const getCurrentTickets = () => {
        switch (activeTab) {
            case 'my-tickets':
                return getFilteredTickets(myTickets);
            case 'assigned':
                return getFilteredTickets(assignedTickets);
            default:
                return getFilteredTickets(tickets);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Open': 'bg-blue-100 text-blue-800',
            'In Progress': 'bg-yellow-100 text-yellow-800',
            'Resolved': 'bg-green-100 text-green-800',
            'Closed': 'bg-gray-100 text-gray-800',
            'Reopened': 'bg-orange-100 text-orange-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Low': 'bg-green-100 text-green-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'High': 'bg-orange-100 text-orange-800',
            'Critical': 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <motion.div 
            className='flex flex-col w-full p-8 gap-5'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center">
                            <Ticket className="mr-3 h-8 w-8" />
                            Ticket Management
                        </h1>
                        <p className="text-indigo-100 mt-2">Create, track, and manage support tickets efficiently</p>
                    </div>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Ticket
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New Ticket</DialogTitle>
                            </DialogHeader>
                            <CreateTicketForm onSubmit={handleCreateTicket} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Statistics */}
            <TicketStatistics />

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search tickets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="Open">Open</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Technical">Technical</SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                    <SelectItem value="Administrative">Administrative</SelectItem>
                                    <SelectItem value="Equipment">Equipment</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Tickets Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All Tickets ({tickets.length})</TabsTrigger>
                    <TabsTrigger value="my-tickets">My Tickets ({myTickets.length})</TabsTrigger>
                    <TabsTrigger value="assigned">Assigned to Me ({assignedTickets.length})</TabsTrigger>
                    <TabsTrigger value="update-tickets">Update Progress</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <TicketGrid 
                        tickets={getCurrentTickets()} 
                        onTicketClick={handleTicketClick}
                        onStatusUpdate={handleStatusUpdate}
                        onAssignTicket={handleAssignTicket}
                        getStatusColor={getStatusColor}
                        getPriorityColor={getPriorityColor}
                        userRole={role}
                    />
                </TabsContent>

                <TabsContent value="my-tickets">
                    <TicketGrid 
                        tickets={getCurrentTickets()} 
                        onTicketClick={handleTicketClick}
                        onStatusUpdate={handleStatusUpdate}
                        onAssignTicket={handleAssignTicket}
                        getStatusColor={getStatusColor}
                        getPriorityColor={getPriorityColor}
                        userRole={role}
                    />
                </TabsContent>

                <TabsContent value="assigned">
                    <TicketGrid 
                        tickets={getCurrentTickets()} 
                        onTicketClick={handleTicketClick}
                        onStatusUpdate={handleStatusUpdate}
                        onAssignTicket={handleAssignTicket}
                        getStatusColor={getStatusColor}
                        getPriorityColor={getPriorityColor}
                        userRole={role}
                    />
                </TabsContent>

                <TabsContent value="update-tickets">
                    <UpdateTickets />
                </TabsContent>
            </Tabs>

            {/* Ticket Details Modal */}
            {selectedTicket && (
                <TicketDetailsModal
                    ticket={selectedTicket}
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    onStatusUpdate={handleStatusUpdate}
                    onAssignTicket={handleAssignTicket}
                    onAddResponse={handleAddResponse}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                    userRole={role}
                />
            )}
        </motion.div>
    );
};

// Ticket Grid Component
const TicketGrid = ({ tickets, onTicketClick, onStatusUpdate, onAssignTicket, getStatusColor, getPriorityColor, userRole }) => {
    if (tickets.length === 0) {
        return (
            <Card className="p-8 text-center">
                <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                <p className="text-gray-500">There are no tickets matching your current filters.</p>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
                <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    onTicketClick={onTicketClick}
                    onStatusUpdate={onStatusUpdate}
                    onAssignTicket={onAssignTicket}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                    userRole={userRole}
                />
            ))}
        </div>
    );
};

export default TicketManagement;