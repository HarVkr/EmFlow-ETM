// import React, { useState, useContext, useMemo, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { 
//     Ticket, 
//     Clock, 
//     CheckCircle2, 
//     AlertCircle, 
//     XCircle,
//     TrendingUp,
//     TrendingDown,
//     BarChart3,
//     PieChart
// } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { GlobalState } from '../../../GlobalState';
// import TicketAPI from '@/api/TicketAPI';

// const TicketStatistics = () => {
//     const state = useContext(GlobalState);
//     const [token] = state.token;
//     const { getTicketStatistics } = useMemo(() => TicketAPI(token), [token]);
    
//     const [stats, setStats] = useState({
//         statusStats: [],
//         categoryStats: [],
//         priorityStats: []
//     });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchStats = async () => {
//             setLoading(true);
//             try {
//                 const data = await getTicketStatistics();
//                 setStats(data || { statusStats: [], categoryStats: [], priorityStats: [] });
//             } catch (error) {
//                 console.error('Error fetching ticket statistics:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStats();
//     }, [getTicketStatistics]);

//     // Process stats data
//     const getStatusCounts = () => {
//         const statusMap = {
//             'Open': 0,
//             'In Progress': 0,
//             'Resolved': 0,
//             'Closed': 0,
//             'Reopened': 0
//         };

//         stats.statusStats.forEach(stat => {
//             if (statusMap.hasOwnProperty(stat._id)) {
//                 statusMap[stat._id] = stat.count;
//             }
//         });

//         return statusMap;
//     };

//     const getPriorityCounts = () => {
//         const priorityMap = {
//             'Low': 0,
//             'Medium': 0,
//             'High': 0,
//             'Critical': 0
//         };

//         stats.priorityStats.forEach(stat => {
//             if (priorityMap.hasOwnProperty(stat._id)) {
//                 priorityMap[stat._id] = stat.count;
//             }
//         });

//         return priorityMap;
//     };

//     const getCategoryCounts = () => {
//         const categoryMap = {
//             'Technical': 0,
//             'HR': 0,
//             'Administrative': 0,
//             'Equipment': 0,
//             'Other': 0
//         };

//         stats.categoryStats.forEach(stat => {
//             if (categoryMap.hasOwnProperty(stat._id)) {
//                 categoryMap[stat._id] = stat.count;
//             }
//         });

//         return categoryMap;
//     };

//     const statusCounts = getStatusCounts();
//     const priorityCounts = getPriorityCounts();
//     const categoryCounts = getCategoryCounts();

//     const totalTickets = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
//     const activeTickets = statusCounts['Open'] + statusCounts['In Progress'] + statusCounts['Reopened'];
//     const resolvedTickets = statusCounts['Resolved'] + statusCounts['Closed'];

//     const getStatusColor = (status) => {
//         const colors = {
//             'Open': 'text-blue-600',
//             'In Progress': 'text-yellow-600',
//             'Resolved': 'text-green-600',
//             'Closed': 'text-gray-600',
//             'Reopened': 'text-orange-600'
//         };
//         return colors[status] || 'text-gray-600';
//     };

//     const getPriorityColor = (priority) => {
//         const colors = {
//             'Low': 'text-green-600',
//             'Medium': 'text-yellow-600',
//             'High': 'text-orange-600',
//             'Critical': 'text-red-600'
//         };
//         return colors[priority] || 'text-gray-600';
//     };

//     const getStatusIcon = (status) => {
//         const icons = {
//             'Open': AlertCircle,
//             'In Progress': Clock,
//             'Resolved': CheckCircle2,
//             'Closed': XCircle,
//             'Reopened': AlertCircle
//         };
//         const Icon = icons[status] || AlertCircle;
//         return <Icon className="h-4 w-4" />;
//     };

//     if (loading) {
//         return (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 {[...Array(4)].map((_, i) => (
//                     <Card key={i} className="animate-pulse">
//                         <CardHeader className="space-y-0 pb-2">
//                             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
//                             <div className="h-3 bg-gray-200 rounded w-2/3"></div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6">
//             {/* Main Statistics Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.1 }}
//                 >
//                     <Card className="border-l-4 border-l-indigo-500">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                             <CardTitle className="text-sm font-medium text-gray-600">
//                                 Total Tickets
//                             </CardTitle>
//                             <Ticket className="h-4 w-4 text-indigo-600" />
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-2xl font-bold text-gray-900">{totalTickets}</div>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 All tickets in the system
//                             </p>
//                         </CardContent>
//                     </Card>
//                 </motion.div>

//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.2 }}
//                 >
//                     <Card className="border-l-4 border-l-yellow-500">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                             <CardTitle className="text-sm font-medium text-gray-600">
//                                 Active Tickets
//                             </CardTitle>
//                             <Clock className="h-4 w-4 text-yellow-600" />
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-2xl font-bold text-gray-900">{activeTickets}</div>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 Open, in progress, or reopened
//                             </p>
//                         </CardContent>
//                     </Card>
//                 </motion.div>

//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.3 }}
//                 >
//                     <Card className="border-l-4 border-l-green-500">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                             <CardTitle className="text-sm font-medium text-gray-600">
//                                 Resolved Tickets
//                             </CardTitle>
//                             <CheckCircle2 className="h-4 w-4 text-green-600" />
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-2xl font-bold text-gray-900">{resolvedTickets}</div>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 Resolved and closed tickets
//                             </p>
//                         </CardContent>
//                     </Card>
//                 </motion.div>

//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.4 }}
//                 >
//                     <Card className="border-l-4 border-l-red-500">
//                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                             <CardTitle className="text-sm font-medium text-gray-600">
//                                 Critical Tickets
//                             </CardTitle>
//                             <AlertCircle className="h-4 w-4 text-red-600" />
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-2xl font-bold text-gray-900">{priorityCounts['Critical']}</div>
//                             <p className="text-xs text-gray-500 mt-1">
//                                 High priority tickets
//                             </p>
//                         </CardContent>
//                     </Card>
//                 </motion.div>
//             </div>

//             {/* Detailed Statistics */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Status Breakdown */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.5 }}
//                 >
//                     <Card>
//                         <CardHeader className="flex flex-row items-center justify-between">
//                             <CardTitle className="text-lg">Status Breakdown</CardTitle>
//                             <BarChart3 className="h-5 w-5 text-gray-500" />
//                         </CardHeader>
//                         <CardContent className="space-y-3">
//                             {Object.entries(statusCounts).map(([status, count]) => (
//                                 <div key={status} className="flex items-center justify-between">
//                                     <div className="flex items-center gap-2">
//                                         <span className={getStatusColor(status)}>
//                                             {getStatusIcon(status)}
//                                         </span>
//                                         <span className="text-sm font-medium">{status}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-sm text-gray-600">{count}</span>
//                                         {totalTickets > 0 && (
//                                             <Badge variant="outline" className="text-xs">
//                                                 {((count / totalTickets) * 100).toFixed(1)}%
//                                             </Badge>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </CardContent>
//                     </Card>
//                 </motion.div>

//                 {/* Priority Breakdown */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.6 }}
//                 >
//                     <Card>
//                         <CardHeader className="flex flex-row items-center justify-between">
//                             <CardTitle className="text-lg">Priority Breakdown</CardTitle>
//                             <TrendingUp className="h-5 w-5 text-gray-500" />
//                         </CardHeader>
//                         <CardContent className="space-y-3">
//                             {Object.entries(priorityCounts).map(([priority, count]) => (
//                                 <div key={priority} className="flex items-center justify-between">
//                                     <div className="flex items-center gap-2">
//                                         <div className={`w-3 h-3 rounded-full ${
//                                             priority === 'Critical' ? 'bg-red-500' :
//                                             priority === 'High' ? 'bg-orange-500' :
//                                             priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
//                                         }`}></div>
//                                         <span className="text-sm font-medium">{priority}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-sm text-gray-600">{count}</span>
//                                         {totalTickets > 0 && (
//                                             <Badge variant="outline" className="text-xs">
//                                                 {((count / totalTickets) * 100).toFixed(1)}%
//                                             </Badge>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </CardContent>
//                     </Card>
//                 </motion.div>

//                 {/* Category Breakdown */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: 0.7 }}
//                 >
//                     <Card>
//                         <CardHeader className="flex flex-row items-center justify-between">
//                             <CardTitle className="text-lg">Category Breakdown</CardTitle>
//                             <PieChart className="h-5 w-5 text-gray-500" />
//                         </CardHeader>
//                         <CardContent className="space-y-3">
//                             {Object.entries(categoryCounts).map(([category, count]) => (
//                                 <div key={category} className="flex items-center justify-between">
//                                     <div className="flex items-center gap-2">
//                                         <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
//                                         <span className="text-sm font-medium">{category}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-sm text-gray-600">{count}</span>
//                                         {totalTickets > 0 && (
//                                             <Badge variant="outline" className="text-xs">
//                                                 {((count / totalTickets) * 100).toFixed(1)}%
//                                             </Badge>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                         </CardContent>
//                     </Card>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default TicketStatistics;
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Ticket, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    XCircle,
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    Users,
    Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlobalState } from '../../../GlobalState';
import TicketAPI from '@/api/TicketAPI';

const TicketStatistics = () => {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [role] = state.role;
    const [teamID] = state.teamID;
    const { getTicketStatistics } = useMemo(() => TicketAPI(token), [token]);
    
    const [stats, setStats] = useState({
        statusStats: [],
        categoryStats: [],
        priorityStats: [],
        totalTickets: 0,
        teamInfo: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("Fetching ticket statistics...");
                const data = await getTicketStatistics();
                console.log("Received statistics data:", data);
                setStats(data || { 
                    statusStats: [], 
                    categoryStats: [], 
                    priorityStats: [],
                    totalTickets: 0,
                    teamInfo: null 
                });
            } catch (error) {
                console.error('Error fetching ticket statistics:', error);
                setError('Failed to load ticket statistics');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        }
    }, [getTicketStatistics, token]);

    // Process stats data
    const getStatusCounts = () => {
        const statusMap = {
            'Open': 0,
            'In Progress': 0,
            'Resolved': 0,
            'Closed': 0,
            'Reopened': 0
        };

        stats.statusStats.forEach(stat => {
            if (statusMap.hasOwnProperty(stat._id)) {
                statusMap[stat._id] = stat.count;
            }
        });

        return statusMap;
    };

    const getPriorityCounts = () => {
        const priorityMap = {
            'Low': 0,
            'Medium': 0,
            'High': 0,
            'Critical': 0
        };

        stats.priorityStats.forEach(stat => {
            if (priorityMap.hasOwnProperty(stat._id)) {
                priorityMap[stat._id] = stat.count;
            }
        });

        return priorityMap;
    };

    const getCategoryCounts = () => {
        const categoryMap = {
            'Technical': 0,
            'HR': 0,
            'Administrative': 0,
            'Equipment': 0,
            'Other': 0
        };

        stats.categoryStats.forEach(stat => {
            if (categoryMap.hasOwnProperty(stat._id)) {
                categoryMap[stat._id] = stat.count;
            }
        });

        return categoryMap;
    };

    const statusCounts = getStatusCounts();
    const priorityCounts = getPriorityCounts();
    const categoryCounts = getCategoryCounts();

    const totalTickets = stats.totalTickets || Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    const activeTickets = statusCounts['Open'] + statusCounts['In Progress'] + statusCounts['Reopened'];
    const resolvedTickets = statusCounts['Resolved'] + statusCounts['Closed'];

    const getStatusColor = (status) => {
        const colors = {
            'Open': 'text-blue-600',
            'In Progress': 'text-yellow-600',
            'Resolved': 'text-green-600',
            'Closed': 'text-gray-600',
            'Reopened': 'text-orange-600'
        };
        return colors[status] || 'text-gray-600';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Low': 'text-green-600',
            'Medium': 'text-yellow-600',
            'High': 'text-orange-600',
            'Critical': 'text-red-600'
        };
        return colors[priority] || 'text-gray-600';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'Open': AlertCircle,
            'In Progress': Clock,
            'Resolved': CheckCircle2,
            'Closed': XCircle,
            'Reopened': AlertCircle
        };
        const Icon = icons[status] || AlertCircle;
        return <Icon className="h-4 w-4" />;
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="space-y-0 pb-2">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Statistics</h3>
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Team Context Info */}
            {(role === 'Team Member' && teamID) && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                            <Users className="h-4 w-4" />
                            Team Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Info className="h-4 w-4" />
                            <span>Showing ticket statistics for your team</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card className="border-l-4 border-l-indigo-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Tickets
                            </CardTitle>
                            <Ticket className="h-4 w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{totalTickets}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                {role === 'Team Manager' ? 'All team tickets' : 'Team tickets'}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Active Tickets
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{activeTickets}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Open, in progress, or reopened
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Resolved Tickets
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{resolvedTickets}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Resolved and closed tickets
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Critical Tickets
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{priorityCounts['Critical']}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                High priority tickets
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Show "No Data" message if no tickets exist */}
            {totalTickets === 0 && (
                <Card className="bg-gray-50">
                    <CardContent className="py-12 text-center">
                        <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Tickets Found</h3>
                        <p className="text-gray-500">
                            {role === 'Team Manager' 
                                ? 'No tickets have been created for your teams yet.'
                                : 'No tickets have been created for your team yet.'
                            }
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Detailed Statistics - Only show if there are tickets */}
            {totalTickets > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Status Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Status Breakdown</CardTitle>
                                <BarChart3 className="h-5 w-5 text-gray-500" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(statusCounts).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={getStatusColor(status)}>
                                                {getStatusIcon(status)}
                                            </span>
                                            <span className="text-sm font-medium">{status}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">{count}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {((count / totalTickets) * 100).toFixed(1)}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Priority Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Priority Breakdown</CardTitle>
                                <TrendingUp className="h-5 w-5 text-gray-500" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(priorityCounts).map(([priority, count]) => (
                                    <div key={priority} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${
                                                priority === 'Critical' ? 'bg-red-500' :
                                                priority === 'High' ? 'bg-orange-500' :
                                                priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}></div>
                                            <span className="text-sm font-medium">{priority}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">{count}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {((count / totalTickets) * 100).toFixed(1)}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Category Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                    >
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Category Breakdown</CardTitle>
                                <PieChart className="h-5 w-5 text-gray-500" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(categoryCounts).map(([category, count]) => (
                                    <div key={category} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                            <span className="text-sm font-medium">{category}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">{count}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {((count / totalTickets) * 100).toFixed(1)}%
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TicketStatistics;