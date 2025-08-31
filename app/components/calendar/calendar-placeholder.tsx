
'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Users,
  Repeat,
  Star
} from "lucide-react"

export function CalendarPlaceholder() {
  // Mock data for demonstration
  const today = new Date()
  const currentMonth = today.toLocaleString('sv-SE', { month: 'long', year: 'numeric' })
  
  const mockEvents = [
    {
      id: 1,
      title: "Teammöte",
      time: "09:00-10:00",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      location: "Konferensrum A"
    },
    {
      id: 2,
      title: "Lunch med klienter",
      time: "12:00-13:30",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      location: "Restaurang Central"
    },
    {
      id: 3,
      title: "Projektgenomgång",
      time: "15:00-16:00",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      recurring: true
    }
  ]

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const startDate = new Date(startOfMonth)
    startDate.setDate(startDate.getDate() - startOfMonth.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === today.getMonth()
      const isToday = currentDate.toDateString() === today.toDateString()
      const hasEvents = Math.random() > 0.7 // Random events for demo
      
      days.push({
        date: new Date(currentDate),
        isCurrentMonth,
        isToday,
        hasEvents,
        eventCount: hasEvents ? Math.floor(Math.random() * 3) + 1 : 0
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()
  const weekdays = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör']

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Händelser idag</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">Kommande</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Repeat className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium">Återkommande</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium">Möten</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{currentMonth}</h3>
              
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekdays.map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      relative h-24 p-1 border border-border/50 rounded-md transition-colors hover:bg-accent/50 cursor-pointer
                      ${!day.isCurrentMonth ? 'opacity-40' : ''}
                      ${day.isToday ? 'bg-primary/10 border-primary' : ''}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <span className={`
                        text-sm font-medium mb-1
                        ${day.isToday ? 'text-primary' : ''}
                        ${!day.isCurrentMonth ? 'text-muted-foreground' : ''}
                      `}>
                        {day.date.getDate()}
                      </span>
                      
                      {day.hasEvents && (
                        <div className="flex-1 space-y-0.5">
                          {Array.from({ length: Math.min(day.eventCount, 2) }).map((_, i) => (
                            <div
                              key={i}
                              className="h-1.5 bg-primary/60 rounded-sm"
                            />
                          ))}
                          {day.eventCount > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{day.eventCount - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Dagens händelser</h4>
              <Badge variant="secondary" className="text-xs">
                {mockEvents.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {mockEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg bg-accent/20 border border-accent/40 hover:bg-accent/30 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="text-sm font-medium">{event.title}</h5>
                        {event.recurring && (
                          <Repeat className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.time}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </p>
                      )}
                    </div>
                    <Badge className={`text-xs ${event.color} border-0`}>
                      •
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Lägg till händelse
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4">Snabbåtgärder</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ny händelse
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Star className="w-4 h-4 mr-2" />
                Favoriter
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Bjud in deltagare
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
