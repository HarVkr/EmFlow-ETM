'use client'

import { useContext, useState } from 'react'
import { CalendarDays, Clock, MapPin, Plus, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import EventAPI from '@/api/EventAPI'
import { useMemo, useCallback, useEffect } from 'react'
import { GlobalState } from '../../../GlobalState'
import Notification from './EventNotification'
import api from '../../../utils/axios'
import moment from 'moment-timezone'
// const mockEvents = [
//   {
//     id: 1,
//     eventName: "Weekly Team Meeting",
//     eventID: "MTG-001",
//     eventDescription: "Regular team sync-up to discuss project progress and blockers.",
//     eventDate: "2024-10-22T12:00:00",
//     eventLocation: "Conference Room A",
//     creationDate: "2024-10-15T09:00:00",
//     invitedEmployees: ["EMP001", "EMP002", "EMP003", "MGR001"]
//   },
//   {
//     id: 2,
//     eventName: "Client Review Meeting",
//     eventID: "MTG-002",
//     eventDescription: "Quarterly review meeting with our key client to discuss project milestones.",
//     eventDate: "2024-10-22T15:00:00",
//     eventLocation: "Virtual - Zoom",
//     creationDate: "2024-10-16T11:00:00",
//     invitedEmployees: ["EMP004", "EMP005", "MGR001"]
//   },
//   {
//     id: 3,
//     eventName: "Leadership Strategy Meeting",
//     eventID: "MTG-003",
//     eventDescription: "Annual leadership meeting to define company goals and strategies for the upcoming year.",
//     eventDate: "2024-10-23T10:00:00",
//     eventLocation: "Boardroom",
//     creationDate: "2024-10-17T14:00:00",
//     invitedEmployees: ["MGR001", "MGR002", "MGR003"]
//   }
// ]

export default function EventCreation() {
  const state = useContext(GlobalState);
  const role = state.role[0];
  const [events, setEvents] = useState([]);
  const [token] = state.token;
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventID: '',
    eventDescription: '',
    eventDate: '',
    eventLocation: '',
    invitedEmployees: ''
  })
  const { getEvents, createEvent } = useMemo(() => EventAPI(token), [token]);
  const [notifications, setNotifications] = useState([])
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getEvents();
        setEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [getEvents]);

  console.log(events);

  useEffect(() => {
    // const checkEventTimes = () => {
    //   const now = new Date();
    //   const now2 = moment().tz('Asia/Kolkata');
    //   console.log("Checking event times at:", now2.format());
    //   console.log("Checking event times at:", now);

    //   events.forEach(event => {
    //     const eventTime = moment(event.eventDate).tz('Asia/Kolkata');
    //     const timeDiff = eventTime.diff(now2);
    //     const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    //     console.log(`Event: ${event.eventName}, Event Time: ${eventTime.format()}, Time Difference: ${minutesDiff} minutes`);

    //     if (minutesDiff === 5) {
    //       console.log(`Reminder: Event "${event.eventName}" is starting in 5 minutes.`);
    //       setNotifications(prev => [...prev, { event, type: 'reminder' }]);
    //     } else if (minutesDiff === 0) {
    //       console.log(`Start: Event "${event.eventName}" is starting now.`);
    //       setNotifications(prev => [...prev, { event, type: 'start' }]);
    //     }
    //   });
    const checkEventTimes = () => {
      const now = moment().tz('Asia/Kolkata');

      events.forEach(event => {
        const eventTime = moment(event.eventDate).tz('Asia/Kolkata');
        const timeDiff = eventTime.diff(now, 'minutes'); // Calculate difference in minutes directly

        // Store notification state in a ref to prevent duplicate notifications
        const notificationKey = `${event._id}_${timeDiff}`;
        const hasNotified = sessionStorage.getItem(notificationKey);

        if (timeDiff <= 5 && timeDiff > 0 && !hasNotified) {
          console.log(`Reminder: Event "${event.eventName}" is starting in ${timeDiff} minutes.`);
          setNotifications(prev => [...prev, { event, type: 'reminder' }]);
          sessionStorage.setItem(notificationKey, 'true');
        }

        if (timeDiff === 0 && !hasNotified) {
          console.log(`Start: Event "${event.eventName}" is starting now.`);
          setNotifications(prev => [...prev, { event, type: 'start' }]);
          sessionStorage.setItem(notificationKey, 'true');
        }
      });
    };

    const intervalId = setInterval(checkEventTimes, 30000); // Check every minute
    checkEventTimes();

    return () => {
      console.log("Clearing interval for checking event times.");
      clearInterval(intervalId);
    };
  }, [events]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewEvent(prev => ({ ...prev, [name]: value }))
  }

  const convertEmployeeuserIDstoMongoIDs = async (userIDs) => {
    try {
      const promises = userIDs.map(async (userID) => {
        const response = await api.post('https://emp-flow-etm-u6a2.vercel.app/employee/get-employee-by-name', { userID }, { headers: { Authorization: `Bearer ${token}` } });
        return response.data._id;
      })
      const results = await Promise.all(promises);
      return results;
    }
    catch (err) {
      console.error("Error converting employee IDs to MongoDB IDs: ", err);
      return [];
    }
  }


  const handleSubmit = async (e) => {

    e.preventDefault();
    console.log("Creating event:", newEvent);
    const invitedEmployeeNames = newEvent.invitedEmployees.split(',').map(name => name.trim());
    const invitedEmployeeIDs = await convertEmployeeuserIDstoMongoIDs(invitedEmployeeNames);
    console.log("Invited Employees:", newEvent.invitedEmployees);
    //const mongoIDs = await convertEmployeeuserIDstoMongoIDs(newEvent.invitedEmployees);
    console.log('Mongo IDs:', invitedEmployeeIDs);

    const createdEvent = {
      // ...newEvent,
      // id: events.length + 1,
      // creationDate: new Date().toISOString(),
      // invitedEmployees: newEvent.invitedEmployees.split(',').map(emp => emp.trim())
      eventName: newEvent.eventName,
      eventID: newEvent.eventID,
      eventDescription: newEvent.eventDescription,
      eventDate: newEvent.eventDate,
      eventLocation: newEvent.eventLocation,
      creationDate: moment().tz('Asia/Kolkata').format(), // Ensure creationDate is set
      invitedEmployees: invitedEmployeeIDs // Ensure invitedEmployees is an array
    }
    console.log("Created Event: ", createdEvent);
    const res = await createEvent(createdEvent);
    console.log("Response: ", res);
    if (res) {
      setEvents([...events, createdEvent]);
      setNewEvent({
        eventName: '',
        eventID: '',
        eventDescription: '',
        eventDate: '',
        eventLocation: '',
        invitedEmployees: ''
      });
    }
  }
  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold ml-3 text-indigo-700">Scheduled Events</h1>
        {role === 'Team Manager' ?
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-indigo-700">
                <Plus className="mr-2 h-2 w-2" /> Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    name="eventName"
                    value={newEvent.eventName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventID">Event ID</Label>
                  <Input
                    id="eventID"
                    name="eventID"
                    value={newEvent.eventID}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDescription">Description</Label>
                  <Textarea
                    id="eventDescription"
                    name="eventDescription"
                    value={newEvent.eventDescription}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Date and Time</Label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="datetime-local"
                    value={newEvent.eventDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventLocation">Location</Label>
                  <Input
                    id="eventLocation"
                    name="eventLocation"
                    value={newEvent.eventLocation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invitedEmployees">Invited Employees (comma-separated)</Label>
                  <Input
                    id="invitedEmployees"
                    name="invitedEmployees"
                    value={newEvent.invitedEmployees}
                    onChange={handleInputChange}
                    placeholder="EMP001, EMP002, EMP003"
                    required
                  />
                </div>
                <Button type="submit">Create Event</Button>
              </form>
            </DialogContent>
          </Dialog>
          : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ml-2">
        {events.map((event) => (
          <Card key={event._id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{event.eventName}</CardTitle>
              <CardDescription className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                {formatDate(event.eventDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="mr-2 h-4 w-4" />
                {event.eventLocation}
              </p>
              <p className="flex items-center text-sm text-gray-500">
                <Users className="mr-2 h-4 w-4" />
                {event.invitedEmployees.length} attendees
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{event.eventName}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p><strong>Event ID:</strong> {event.eventID}</p>
                    <p><strong>Description:</strong> {event.eventDescription}</p>
                    <p><strong>Date and Time:</strong> {formatDate(event.eventDate)}</p>
                    <p><strong>Location:</strong> {event.eventLocation}</p>
                    <p><strong>Created:</strong> {formatDate(event.creationDate)}</p>
                    <div>
                      <strong>Invited Employees:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {event.invitedEmployees.map((emp, index) => (
                          <Avatar key={index} className="h-8 w-8">
                            <AvatarFallback>{emp.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}