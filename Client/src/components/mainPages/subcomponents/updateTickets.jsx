import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { Clock, PlayCircle, CheckCircle2, XCircle, RotateCcw, MessageSquare, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { GlobalState } from '../../../GlobalState';
import TicketAPI from '@/api/TicketAPI';

const UpdateTickets = () => {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [userID] = state.userID; // Assuming userID is available in GlobalState
    
    const [myTickets, setMyTickets] = useState([]);
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingTickets, setUpdatingTickets] = useState(new Set());
    
    const { 
        getMyTickets, 
        getAssignedTickets, 
        updateTicketStatus,
        addResponse 
    } = useMemo(() => TicketAPI(token), [token]);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const [myTicketsData, assignedTicketsData] = await Promise.all([
                getMyTickets(),
                getAssignedTickets()
            ]);
            
            setMyTickets(myTicketsData || []);
            setAssignedTickets(assignedTicketsData || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    }, [getMyTickets, getAssignedTickets]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleStatusUpdate = async (ticketId, newStatus) => {
        setUpdatingTickets(prev => new Set([...prev, ticketId]));
        try {
            await updateTicketStatus(ticketId, newStatus);
            await fetchTickets(); // Refresh the tickets
        } catch (error) {
            console.error('Error updating ticket status:', error);
        } finally {
            setUpdatingTickets(prev => {
                const newSet = new Set(prev);
                newSet.delete(ticketId);
                return newSet;
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    const getStatusActions = (ticket) => {
        const actions = [];
        const isUpdating = updatingTickets.has(ticket._id);

        switch (ticket.status) {
            case 'Open':
                actions.push({
                    label: 'Start Working',
                    icon: <PlayCircle className="h-4 w-4" />,
                    action: () => handleStatusUpdate(ticket._id, 'In Progress'),
                    className: 'bg-blue-600 hover:bg-blue-700 text-white',
                    disabled: isUpdating
                });
                break;
            case 'In Progress':
                actions.push({
                    label: 'Mark Resolved',
                    icon: <CheckCircle2 className="h-4 w-4" />,
                    action: () => handleStatusUpdate(ticket._id, 'Resolved'),
                    className: 'bg-green-600 hover:bg-green-700 text-white',
                    disabled: isUpdating
                });
                actions.push({
                    label: 'Reopen',
                    icon: <RotateCcw className="h-4 w-4" />,
                    action: () => handleStatusUpdate(ticket._id, 'Open'),
                    className: 'bg-orange-600 hover:bg-orange-700 text-white',
                    disabled: isUpdating
                });
                break;
            case 'Resolved':
                // Only show close option for managers or ticket creators
                break;
        }

        return actions;
    };

    const TicketCard = ({ ticket, isAssigned }) => {
        const actions = getStatusActions(ticket);
        const [responseText, setResponseText] = useState('');
        const [addingResponse, setAddingResponse] = useState(false);

        const handleAddResponse = async () => {
            if (!responseText.trim()) return;
            
            setAddingResponse(true);
            try {
                await addResponse(ticket._id, {
                    responseText,
                    isInternal: false,
                    responseType: 'Response'
                });
                setResponseText('');
                await fetchTickets(); // Refresh to get updated responses
            } catch (error) {
                console.error('Error adding response:', error);
            } finally {
                setAddingResponse(false);
            }
        };

        return (
            <Card className="w-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg mb-1 truncate">{ticket.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">#{ticket.ticketID}</span>
                                <Badge variant="outline" className="text-xs">
                                    {ticket.category}
                                </Badge>
                            </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                            <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                                {ticket.priority}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                        {ticket.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Created: {formatDate(ticket.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>{ticket.responses?.length || 0} responses</span>
                        </div>
                    </div>

                    {/* Assignment Info */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">
                                {isAssigned ? 'Assigned by:' : 'Assigned to:'}
                            </span>
                            <span className="font-medium">
                                {isAssigned 
                                    ? ticket.createdBy?.userID || 'Unknown'
                                    : ticket.assignedTo?.userID || 'Unassigned'
                                }
                            </span>
                        </div>
                        {isAssigned && (
                            <Badge variant="secondary" className="text-xs">
                                Assigned to you
                            </Badge>
                        )}
                    </div>

                    {/* Quick Response */}
                    {isAssigned && (
                        <div className="space-y-2 pt-2 border-t">
                            <Textarea
                                placeholder="Add a quick response..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                rows={2}
                                className="text-sm"
                            />
                            <Button
                                size="sm"
                                onClick={handleAddResponse}
                                disabled={!responseText.trim() || addingResponse}
                                className="w-full"
                            >
                                {addingResponse ? 'Adding...' : 'Add Response'}
                            </Button>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-wrap gap-2 pt-2">
                    {/* Status Actions for Assigned Tickets */}
                    {isAssigned && actions.map((action, index) => (
                        <Button
                            key={index}
                            size="sm"
                            className={action.className}
                            onClick={action.action}
                            disabled={action.disabled}
                        >
                            {action.icon}
                            <span className="ml-1">
                                {action.disabled ? 'Updating...' : action.label}
                            </span>
                        </Button>
                    ))}

                    {/* View Details Dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                View Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>{ticket.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                <div>
                                    <strong>Ticket ID:</strong> {ticket.ticketID}
                                </div>
                                <div>
                                    <strong>Description:</strong>
                                    <p className="mt-1 text-gray-700">{ticket.description}</p>
                                </div>
                                <div>
                                    <strong>Category:</strong> {ticket.category}
                                </div>
                                <div>
                                    <strong>Priority:</strong> {ticket.priority}
                                </div>
                                <div>
                                    <strong>Status:</strong> 
                                    <Badge className={`ml-2 ${getStatusColor(ticket.status)}`}>
                                        {ticket.status}
                                    </Badge>
                                </div>
                                <div>
                                    <strong>Created:</strong> {formatDate(ticket.createdAt)}
                                </div>
                                <div>
                                    <strong>Last Updated:</strong> {formatDate(ticket.updatedAt)}
                                </div>
                                {ticket.tags && ticket.tags.length > 0 && (
                                    <div>
                                        <strong>Tags:</strong>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {ticket.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {ticket.responses && ticket.responses.length > 0 && (
                                    <div>
                                        <strong>Recent Responses:</strong>
                                        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                                            {ticket.responses.slice(-3).map((response, index) => (
                                                <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                                                    <div className="font-medium">
                                                        {response.respondedBy?.userID || 'Unknown'}
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            {formatDate(response.createdAt)}
                                                        </span>
                                                    </div>
                                                    <div className="text-gray-700 mt-1">
                                                        {response.responseText}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto p-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 pb-4 pt-7">
            <h1 className="text-xl font-bold mb-6 text-indigo-700">My Tickets</h1>
            
            {/* Assigned Tickets Section */}
            {assignedTickets.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Assigned to Me ({assignedTickets.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignedTickets.map((ticket) => (
                            <TicketCard key={ticket._id} ticket={ticket} isAssigned={true} />
                        ))}
                    </div>
                </div>
            )}

            {/* My Created Tickets Section */}
            {myTickets.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Created by Me ({myTickets.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myTickets.map((ticket) => (
                            <TicketCard key={ticket._id} ticket={ticket} isAssigned={false} />
                        ))}
                    </div>
                </div>
            )}

            {/* No Tickets State */}
            {assignedTickets.length === 0 && myTickets.length === 0 && (
                <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                    <p className="text-gray-500">You don't have any tickets assigned to you or created by you.</p>
                </div>
            )}
        </div>
    );
};

export default UpdateTickets;