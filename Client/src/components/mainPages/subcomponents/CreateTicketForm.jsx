// import React, { useState, useContext, useMemo, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { X, Plus } from 'lucide-react';
// import { GlobalState } from '../../../GlobalState';
// import UserAPI from '@/api/UserAPI';

// const CreateTicketForm = ({ onSubmit }) => {
//     const state = useContext(GlobalState);
//     const [token] = state.token;
//     const { getEmployeeDatabyIDs } = useMemo(() => UserAPI(token), [token]);

//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         category: '',
//         priority: 'Medium',
//         assignedTo: '',
//         tags: []
//     });
    
//     const [newTag, setNewTag] = useState('');
//     const [employees, setEmployees] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         // Fetch employees for assignment dropdown
//         const fetchEmployees = async () => {
//             try {
//                 // This would need to be implemented in your UserAPI
//                 // For now, we'll leave it as empty array
//                 setEmployees([]);
//             } catch (error) {
//                 console.error('Error fetching employees:', error);
//             }
//         };
//         fetchEmployees();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
        
//         // Clear error when user starts typing
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     };

//     const handleSelectChange = (name, value) => {
//         setFormData(prev => ({ ...prev, [name]: value }));
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: '' }));
//         }
//     };

//     const handleAddTag = () => {
//         if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
//             setFormData(prev => ({
//                 ...prev,
//                 tags: [...prev.tags, newTag.trim()]
//             }));
//             setNewTag('');
//         }
//     };

//     const handleRemoveTag = (tagToRemove) => {
//         setFormData(prev => ({
//             ...prev,
//             tags: prev.tags.filter(tag => tag !== tagToRemove)
//         }));
//     };

//     const validateForm = () => {
//         const newErrors = {};
        
//         if (!formData.title.trim()) {
//             newErrors.title = 'Title is required';
//         }
        
//         if (!formData.description.trim()) {
//             newErrors.description = 'Description is required';
//         }
        
//         if (!formData.category) {
//             newErrors.category = 'Category is required';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!validateForm()) {
//             return;
//         }

//         setLoading(true);
//         try {
//             await onSubmit(formData);
//             // Reset form on successful submission
//             setFormData({
//                 title: '',
//                 description: '',
//                 category: '',
//                 priority: 'Medium',
//                 assignedTo: '',
//                 tags: []
//             });
//         } catch (error) {
//             console.error('Error creating ticket:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title */}
//             <div className="space-y-2">
//                 <Label htmlFor="title">Title *</Label>
//                 <Input
//                     id="title"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     placeholder="Brief description of the issue..."
//                     className={errors.title ? 'border-red-500' : ''}
//                 />
//                 {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
//             </div>

//             {/* Description */}
//             <div className="space-y-2">
//                 <Label htmlFor="description">Description *</Label>
//                 <Textarea
//                     id="description"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Provide detailed information about the issue..."
//                     rows={4}
//                     className={errors.description ? 'border-red-500' : ''}
//                 />
//                 {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
//             </div>

//             {/* Category and Priority Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label htmlFor="category">Category *</Label>
//                     <Select
//                         value={formData.category}
//                         onValueChange={(value) => handleSelectChange('category', value)}
//                     >
//                         <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
//                             <SelectValue placeholder="Select category..." />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="Technical">Technical</SelectItem>
//                             <SelectItem value="HR">HR</SelectItem>
//                             <SelectItem value="Administrative">Administrative</SelectItem>
//                             <SelectItem value="Equipment">Equipment</SelectItem>
//                             <SelectItem value="Other">Other</SelectItem>
//                         </SelectContent>
//                     </Select>
//                     {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
//                 </div>

//                 <div className="space-y-2">
//                     <Label htmlFor="priority">Priority</Label>
//                     <Select
//                         value={formData.priority}
//                         onValueChange={(value) => handleSelectChange('priority', value)}
//                     >
//                         <SelectTrigger>
//                             <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="Low">Low</SelectItem>
//                             <SelectItem value="Medium">Medium</SelectItem>
//                             <SelectItem value="High">High</SelectItem>
//                             <SelectItem value="Critical">Critical</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>
//             </div>

//             {/* Assign To (Optional) */}
//             <div className="space-y-2">
//                 <Label htmlFor="assignedTo">Assign To (Optional)</Label>
//                 <Select
//                     value={formData.assignedTo}
//                     onValueChange={(value) => handleSelectChange('assignedTo', value)}
//                 >
//                     <SelectTrigger>
//                         <SelectValue placeholder="Select assignee..." />
//                     </SelectTrigger>
//                     <SelectContent>
//                         {employees.map((employee) => (
//                             <SelectItem key={employee._id} value={employee._id}>
//                                 {employee.userID} - {employee.role}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//             </div>

//             {/* Tags */}
//             <div className="space-y-2">
//                 <Label>Tags (Optional)</Label>
//                 <div className="flex gap-2 items-center">
//                     <Input
//                         value={newTag}
//                         onChange={(e) => setNewTag(e.target.value)}
//                         placeholder="Add a tag..."
//                         onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
//                         className="flex-1"
//                     />
//                     <Button 
//                         type="button" 
//                         onClick={handleAddTag}
//                         variant="outline"
//                         size="sm"
//                     >
//                         <Plus className="h-4 w-4" />
//                     </Button>
//                 </div>
                
//                 {formData.tags.length > 0 && (
//                     <div className="flex flex-wrap gap-2 mt-2">
//                         {formData.tags.map((tag, index) => (
//                             <Badge key={index} variant="secondary" className="flex items-center gap-1">
//                                 {tag}
//                                 <X 
//                                     className="h-3 w-3 cursor-pointer hover:text-red-500" 
//                                     onClick={() => handleRemoveTag(tag)}
//                                 />
//                             </Badge>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end space-x-3 pt-4 border-t">
//                 <Button 
//                     type="submit" 
//                     disabled={loading}
//                     className="bg-indigo-600 hover:bg-indigo-700"
//                 >
//                     {loading ? 'Creating...' : 'Create Ticket'}
//                 </Button>
//             </div>
//         </form>
//     );
// };

// export default CreateTicketForm;

import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, User, Users, UserCheck } from 'lucide-react';
import { GlobalState } from '../../../GlobalState';
import TicketAPI from '@/api/TicketAPI';

const CreateTicketForm = ({ onSubmit }) => {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [role] = state.role;
    const [teamID] = state.teamID;
    const { getTeamMembersForTickets } = useMemo(() => TicketAPI(token), [token]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        assignedTo: '',
        tags: []
    });
    
    const [newTag, setNewTag] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch team members for assignment dropdown
        const fetchTeamMembers = async () => {
            setLoadingMembers(true);
            try {
                const members = await getTeamMembersForTickets();
                setTeamMembers(members);
                console.log('Team members for ticket assignment:', members);
            } catch (error) {
                console.error('Error fetching team members:', error);
                setTeamMembers([]);
            } finally {
                setLoadingMembers(false);
            }
        };
        
        if (token) {
            fetchTeamMembers();
        }
    }, [getTeamMembersForTickets, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.assignedTo) {
            newErrors.assignedTo = 'Please assign the ticket to a team member';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // The assignedTo field already contains the employee ID
            await onSubmit(formData);
            
            // Reset form on successful submission
            setFormData({
                title: '',
                description: '',
                category: '',
                priority: 'Medium',
                assignedTo: '',
                tags: []
            });
        } catch (error) {
            console.error('Error creating ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'Team Manager':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Team Member':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Admin':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Team Manager':
                return <Users className="h-3 w-3" />;
            case 'Team Member':
                return <User className="h-3 w-3" />;
            default:
                return <User className="h-3 w-3" />;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Context Info */}
            {role && (
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                            <Users className="h-4 w-4" />
                            Team Assignment Context
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <span>Your Role: </span>
                            <Badge className={getRoleColor(role)}>
                                {getRoleIcon(role)}
                                <span className="ml-1">{role}</span>
                            </Badge>
                        </div>
                        <p className="text-xs text-blue-500 mt-2">
                            {role === 'Team Manager' 
                                ? 'You can assign tickets to any member in your teams.'
                                : 'You can assign tickets to your team members and manager.'
                            }
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief description of the issue..."
                    className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide detailed information about the issue..."
                    rows={4}
                    className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Category and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                    >
                        <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Administrative">Administrative</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                        value={formData.priority}
                        onValueChange={(value) => handleSelectChange('priority', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Assign To Team Member - Now Required */}
            <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To Team Member *</Label>
                <Select
                    value={formData.assignedTo}
                    onValueChange={(value) => handleSelectChange('assignedTo', value)}
                    disabled={loadingMembers}
                >
                    <SelectTrigger className={errors.assignedTo ? 'border-red-500' : ''}>
                        <SelectValue placeholder={
                            loadingMembers ? "Loading team members..." : "Select team member..."
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        {teamMembers.map((member) => (
                            <SelectItem key={member._id} value={member._id}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        {getRoleIcon(member.role)}
                                        <span className="font-medium">{member.userID}</span>
                                    </div>
                                    <Badge 
                                        variant="outline" 
                                        className={`ml-2 text-xs ${getRoleColor(member.role)}`}
                                    >
                                        {member.role}
                                    </Badge>
                                </div>
                            </SelectItem>
                        ))}
                        {teamMembers.length === 0 && !loadingMembers && (
                            <SelectItem value="" disabled>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <User className="h-4 w-4" />
                                    <span>No team members available</span>
                                </div>
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
                {errors.assignedTo && <p className="text-sm text-red-500">{errors.assignedTo}</p>}
                
                {/* Show current assignment */}
                {formData.assignedTo && (
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">
                                    Assigned to: 
                                </span>
                                <span className="text-sm font-bold text-green-800">
                                    {teamMembers.find(member => member._id === formData.assignedTo)?.userID}
                                </span>
                                <Badge 
                                    variant="outline" 
                                    className={`text-xs ${getRoleColor(
                                        teamMembers.find(member => member._id === formData.assignedTo)?.role
                                    )}`}
                                >
                                    {teamMembers.find(member => member._id === formData.assignedTo)?.role}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Team Members Count Info */}
                {!loadingMembers && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>
                            {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} available for assignment
                        </span>
                    </div>
                )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <Label>Tags (Optional)</Label>
                <div className="flex gap-2 items-center">
                    <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1"
                    />
                    <Button 
                        type="button" 
                        onClick={handleAddTag}
                        variant="outline"
                        size="sm"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                
                {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <X 
                                    className="h-3 w-3 cursor-pointer hover:text-red-500" 
                                    onClick={() => handleRemoveTag(tag)}
                                />
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                    type="submit" 
                    disabled={loading || loadingMembers}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    {loading ? 'Creating...' : 'Create Ticket'}
                </Button>
            </div>
        </form>
    );
};

export default CreateTicketForm;