import React, { useState, useContext, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/seperator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    Clock, 
    User, 
    MessageSquare, 
    Send, 
    Calendar,
    Tag,
    AlertCircle,
    CheckCircle2,
    UserPlus,
    Edit,
    PlayCircle,
    XCircle,
    RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { GlobalState } from '../../../GlobalState';
import UserAPI from '@/api/UserAPI';

const TicketDetailsModal = ({ 
    ticket, 
    isOpen, 
    onClose, 
    onStatusUpdate, 
    onAssignTicket, 
    onAddResponse,
    getStatusColor,
    getPriorityColor,
    userRole 
}) => {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [userID] = state.userID; // Assuming userID is in GlobalState
    const { getEmployeeDatabyIDs } = useMemo(() => UserAPI(token), [token]);
    
    const [newResponse, setNewResponse] = useState('');
    const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(ticket?.status || 'Open');
    const [selectedAssignee, setSelectedAssignee] = useState(ticket?.assignedTo?._id || '');
    const [employees, setEmployees] = useState([]);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    React.useEffect(() => {
        // Fetch employees for assignment dropdown - simplified for demo
        setEmployees([
            { _id: '1', userID: 'john.doe', role: 'Team Member' },
            { _id: '2', userID: 'jane.smith', role: 'Team Manager' },
            { _id: '3', userID: 'bob.wilson', role: 'Team Member' }
        ]);
    }, []);

    React.useEffect(() => {
        if (ticket) {
            setSelectedStatus(ticket.status);
            setSelectedAssignee(ticket.assignedTo?._id || '');
        }
    }, [ticket]);

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
        } catch (error) {
            return 'Invalid date';
        }
    };

    const handleAddResponse = async () => {
        if (!newResponse.trim()) return;

        setIsSubmittingResponse(true);
        try {
            await onAddResponse(ticket._id, {
                responseText: newResponse,
                isInternal: false,
                responseType: 'Response'
            });
            setNewResponse('');
        } catch (error) {
            console.error('Error adding response:', error);
        } finally {
            setIsSubmittingResponse(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (newStatus !== ticket.status && canUpdateTicket()) {
            setIsUpdatingStatus(true);
            try {
                await onStatusUpdate(ticket._id, newStatus);
                setSelectedStatus(newStatus);
            } catch (error) {
                console.error('Error updating status:', error);
            } finally {
                setIsUpdatingStatus(false);
            }
        }
    };

    const handleAssigneeChange = async (assigneeId) => {
        if (assigneeId !== ticket.assignedTo?._id) {
            await onAssignTicket(ticket._id, assigneeId || null);
        }
    };

    const canUpdateTicket = () => {
        return userRole === 'Team Manager' || 
               ticket.createdBy?._id === userID ||
               ticket.assignedTo?._id === userID;
    };

    const isAssignedToCurrentUser = () => {
        return ticket.assignedTo?._id === userID;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open':
                return <AlertCircle className="h-4 w-4" />;
            case 'In Progress':
                return <Clock className="h-4 w-4" />;
            case 'Resolved':
            case 'Closed':
                return <CheckCircle2 className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getStatusAction = (currentStatus) => {
        switch (currentStatus) {
            case 'Open':
                return {
                    action: 'In Progress',
                    label: 'Start Working',
                    icon: <PlayCircle className="h-4 w-4" />,
                    color: 'bg-blue-600 hover:bg-blue-700'
                };
            case 'In Progress':
                return {
                    action: 'Resolved',
                    label: 'Mark Resolved',
                    icon: <CheckCircle2 className="h-4 w-4" />,
                    color: 'bg-green-600 hover:bg-green-700'
                };
            case 'Resolved':
                return {
                    action: 'Closed',
                    label: 'Close Ticket',
                    icon: <XCircle className="h-4 w-4" />,
                    color: 'bg-gray-600 hover:bg-gray-700'
                };
            default:
                return null;
        }
    };

    if (!ticket) return null;

    const statusAction = getStatusAction(ticket.status);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-indigo-600" />
                                {ticket.title}
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">#{ticket.ticketID}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(ticket.status)}>
                                <span className="flex items-center gap-1">
                                    {getStatusIcon(ticket.status)}
                                    {ticket.status}
                                </span>
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                                {ticket.priority}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Assignment Status */}
                        {isAssignedToCurrentUser() && (
                            <Card className="bg-blue-50 border-blue-200">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                                        <User className="h-4 w-4" />
                                        Ticket Assignment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-blue-600">
                                            This ticket is assigned to you. You can update its status.
                                        </div>
                                        {statusAction && ticket.status !== 'Closed' && (
                                            <Button
                                                size="sm"
                                                className={statusAction.color}
                                                onClick={() => handleStatusChange(statusAction.action)}
                                                disabled={isUpdatingStatus}
                                            >
                                                {statusAction.icon}
                                                <span className="ml-1">
                                                    {isUpdatingStatus ? 'Updating...' : statusAction.label}
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Ticket Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                                
                                {/* Tags */}
                                {ticket.tags && ticket.tags.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tag className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Tags</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {ticket.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Responses */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Responses ({ticket.responses?.length || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-64 mb-4">
                                    {ticket.responses && ticket.responses.length > 0 ? (
                                        <div className="space-y-4">
                                            {ticket.responses.map((response, index) => (
                                                <div key={index} className="border-l-4 border-indigo-200 pl-4 py-2">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarFallback className="text-xs">
                                                                    {response.respondedBy?.userID?.substring(0, 2).toUpperCase() || 'UN'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-sm font-medium">
                                                                {response.respondedBy?.userID || 'Unknown'}
                                                            </span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {response.responseType || 'Response'}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-xs text-gray-500">
                                                            {formatDate(response.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                        {response.responseText}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p>No responses yet</p>
                                        </div>
                                    )}
                                </ScrollArea>

                                {/* Add Response */}
                                <div className="space-y-3 pt-4 border-t">
                                    <Label htmlFor="response">Add Response</Label>
                                    <Textarea
                                        id="response"
                                        placeholder="Type your response here..."
                                        value={newResponse}
                                        onChange={(e) => setNewResponse(e.target.value)}
                                        rows={3}
                                    />
                                    <Button 
                                        onClick={handleAddResponse}
                                        disabled={!newResponse.trim() || isSubmittingResponse}
                                        className="w-full"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        {isSubmittingResponse ? 'Sending...' : 'Send Response'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Ticket Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Ticket Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-600">Created:</span>
                                        <span>{formatDate(ticket.createdAt)}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-600">Updated:</span>
                                        <span>{formatDate(ticket.updatedAt)}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-600">Created by:</span>
                                        <span>{ticket.createdBy?.userID || 'Unknown'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Tag className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-600">Category:</span>
                                        <Badge variant="outline" className="text-xs">{ticket.category}</Badge>
                                    </div>
                                </div>

                                <Separator />

                                {/* Status Update for Managers */}
                                {canUpdateTicket() && userRole === 'Team Manager' && (
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select value={selectedStatus} onValueChange={handleStatusChange}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Open">Open</SelectItem>
                                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                                    <SelectItem value="Closed">Closed</SelectItem>
                                                    <SelectItem value="Reopened">Reopened</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="assignee">Assigned To</Label>
                                            <Select value={selectedAssignee} onValueChange={handleAssigneeChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select assignee..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">Unassigned</SelectItem>
                                                    {employees.map((employee) => (
                                                        <SelectItem key={employee._id} value={employee._id}>
                                                            {employee.userID} - {employee.role}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {/* Current Assignment */}
                                {ticket.assignedTo && (
                                    <div className="space-y-2">
                                        <Label>Currently Assigned To</Label>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-xs">
                                                    {ticket.assignedTo.userID?.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{ticket.assignedTo.userID}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {ticket.assignedTo.role}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions for Assigned Users */}
                        {isAssignedToCurrentUser() && ticket.status !== 'Closed' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Status Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {ticket.status === 'Open' && (
                                        <Button 
                                            variant="outline" 
                                            className="w-full bg-blue-50 hover:bg-blue-100"
                                            onClick={() => handleStatusChange('In Progress')}
                                            disabled={isUpdatingStatus}
                                        >
                                            <PlayCircle className="h-4 w-4 mr-2" />
                                            Start Working
                                        </Button>
                                    )}
                                    
                                    {ticket.status === 'In Progress' && (
                                        <>
                                            <Button 
                                                variant="outline" 
                                                className="w-full bg-green-50 hover:bg-green-100"
                                                onClick={() => handleStatusChange('Resolved')}
                                                disabled={isUpdatingStatus}
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Mark Resolved
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="w-full bg-red-50 hover:bg-red-100"
                                                onClick={() => handleStatusChange('Open')}
                                                disabled={isUpdatingStatus}
                                            >
                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                Reopen Ticket
                                            </Button>
                                        </>
                                    )}

                                    {ticket.status === 'Resolved' && userRole === 'Team Manager' && (
                                        <Button 
                                            variant="outline" 
                                            className="w-full bg-gray-50 hover:bg-gray-100"
                                            onClick={() => handleStatusChange('Closed')}
                                            disabled={isUpdatingStatus}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Close Ticket
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TicketDetailsModal;