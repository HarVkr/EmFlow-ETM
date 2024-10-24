import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function Notification({ event, type, onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose()
    }, 10000) // Auto-dismiss after 10 seconds

    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {type === 'reminder' ? 'Event Reminder' : 'Event Starting'}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => { setVisible(false); onClose() }}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-semibold">{event.eventName}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(event.eventDate).toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">{event.eventLocation}</p>
      </CardContent>
    </Card>
  )
}

Notification.propTypes = {
  event: PropTypes.shape({
    eventName: PropTypes.string.isRequired,
    eventDate: PropTypes.string.isRequired,
    eventLocation: PropTypes.string.isRequired
  }).isRequired,
  type: PropTypes.oneOf(['reminder', 'start']).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Notification;