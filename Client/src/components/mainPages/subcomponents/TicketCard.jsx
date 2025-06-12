import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, User, AlertCircle, MessageSquare, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const TicketCard = ({ 
    ticket, 
    onTicketClick, 
    onStatusUpdate, 
    onAssignTicket, 
    getStatusColor, 
    getPriorityColor, 
    userRole 
}) => {
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
        } catch (error) {
            return 'Invalid date';
        }
    };

    const canUpdateStatus = () => {
        return userRole === 'Team Manager' || 
               ticket.createdBy?._id === ticket.currentUserId ||
               ticket.assignedTo?._id === ticket.currentUserId;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open':
                return <AlertCircle className="h-4 w-4" />;
            case 'In Progress':
                return <Clock className="h-4 w-4" />;
            case 'Resolved':
            case 'Closed':
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-indigo-500">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h3 
                            className="font-semibold text-lg text-gray-900 truncate hover:text-indigo-600 transition-colors"
                            onClick={() => onTicketClick(ticket)}
                        >
                            {ticket.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            #{ticket.ticketID}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
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
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Description Preview */}
                <p className="text-sm text-gray-600 line-clamp-3">
                    {ticket.description}
                </p>

                {/* Category and Tags */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                        {ticket.category}
                    </Badge>
                    {ticket.tags && ticket.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {ticket.tags && ticket.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                            +{ticket.tags.length - 2} more
                        </Badge>
                    )}
                </div>

                {/* Creator and Assignee Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>By: {ticket.createdBy?.userID || 'Unknown'}</span>
                    </div>
                    {ticket.assignedTo && (
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                    {ticket.assignedTo.userID?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span>{ticket.assignedTo.userID}</span>
                        </div>
                    )}
                </div>

                {/* Responses Count and Date */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
                    <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{ticket.responses?.length || 0} responses</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                </div>

                {/* Quick Actions */}
                {canUpdateStatus() && (
                    <div className="flex gap-2 pt-2">
                        {ticket.status === 'Open' && (
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusUpdate(ticket._id, 'In Progress');
                                }}
                                className="text-xs"
                            >
                                Start Progress
                            </Button>
                        )}
                        {ticket.status === 'In Progress' && (
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusUpdate(ticket._id, 'Resolved');
                                }}
                                className="text-xs"
                            >
                                Mark Resolved
                            </Button>
                        )}
                        <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => onTicketClick(ticket)}
                            className="text-xs"
                        >
                            View Details
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TicketCard;