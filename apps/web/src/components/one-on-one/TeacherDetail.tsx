import { useState } from "react"
import { Star, Clock, DollarSign, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

interface TeacherDetailProps {
  teacher: {
    id: string
    name: string
    designation: string
    bio: string
    image: string
    rating: number
    reviews: number
    price: number
    hourlyRate?: number
    experience?: number
    specializations?: string[]
  }
}

export function TeacherDetail({ teacher }: TeacherDetailProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // Generate available time slots
  const timeSlots: TimeSlot[] = [
    { id: "1", time: "09:00 AM", available: true },
    { id: "2", time: "10:00 AM", available: true },
    { id: "3", time: "11:00 AM", available: false },
    { id: "4", time: "01:00 PM", available: true },
    { id: "5", time: "02:00 PM", available: true },
    { id: "6", time: "03:00 PM", available: false },
    { id: "7", time: "04:00 PM", available: true },
    { id: "8", time: "05:00 PM", available: true },
  ]

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate)
    setSelectedSlot(null)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="grid md:grid-cols-3 gap-4 p-4 md:p-6">
      {/* Left Column - Teacher Info */}
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Teacher Image */}
              <img
                src={teacher.image || "/placeholder.svg"}
                alt={teacher.name}
                className="w-full h-48 object-cover rounded-lg"
              />

              {/* Teacher Name and Designation */}
              <div>
                <h2 className="text-xl font-bold text-primary mb-1">{teacher.name}</h2>
                <p className="text-sm text-muted-foreground">{teacher.designation}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(teacher.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{teacher.rating}</span>
                <span className="text-xs text-muted-foreground">({teacher.reviews})</span>
              </div>

              {/* Price */}
              <Card className="bg-accent/10">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-primary" />
                      <span className="text-xs text-muted-foreground">Rate/hour</span>
                    </div>
                    <span className="text-xl font-bold text-primary">${teacher.price}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Experience and Specializations */}
              <div className="space-y-2">
                {teacher.experience && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">EXPERIENCE</p>
                    <p className="text-sm">{teacher.experience}+ years</p>
                  </div>
                )}

                {teacher.specializations && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">SPECIALIZATIONS</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.specializations.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Booking */}
      <div className="md:col-span-2 space-y-4">
        {/* Bio */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground leading-relaxed">{teacher.bio}</p>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Select Date</CardTitle>
            <CardDescription className="text-xs">Choose your preferred date for the session</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-accent rounded-lg" aria-label="Previous month">
                <ChevronLeft size={18} />
              </button>
              <h3 className="text-sm font-semibold">{monthName}</h3>
              <button onClick={handleNextMonth} className="p-1 hover:bg-accent rounded-lg" aria-label="Next month">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div>
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-0 mb-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {[...Array(firstDay)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {days.map((day) => {
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                  const isSelected = selectedDate.toDateString() === date.toDateString()
                  const isToday = new Date().toDateString() === date.toDateString()

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`
                        aspect-square rounded text-xs font-medium
                        transition-colors border flex items-center justify-center
                        ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : isToday
                              ? "border-primary text-primary bg-primary/5"
                              : "border-border hover:bg-accent"
                        }
                      `}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Date Display */}
            <div className="pt-2 mt-2 border-t text-xs">
              <p className="text-muted-foreground mb-1">Selected Date:</p>
              <p className="font-semibold text-sm">{formatDate(selectedDate)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Select Time Slot</CardTitle>
            <CardDescription className="text-xs">Available times for {formatDate(selectedDate)}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedSlot(slot.id)}
                  disabled={!slot.available}
                  className={`
                    py-2 px-2 rounded text-xs font-medium border
                    transition-all flex items-center justify-center gap-1
                    ${
                      !slot.available
                        ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground border-border"
                        : selectedSlot === slot.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary hover:bg-accent"
                    }
                  `}
                >
                  <Clock size={14} />
                  {slot.time}
                </button>
              ))}
            </div>

            {/* Slot Status */}
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-muted rounded" />
                <span>Booked</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Summary and Button */}
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Date:</span>
                  <span className="font-medium">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Time:</span>
                  <span className="font-medium">
                    {selectedSlot ? timeSlots.find((s) => s.id === selectedSlot)?.time : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">1 Hour</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between items-center gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total:</p>
                  <p className="text-lg font-bold text-primary">${teacher.price}</p>
                </div>
                <Button size="sm" disabled={!selectedSlot} className="flex-1">
                  Book Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
