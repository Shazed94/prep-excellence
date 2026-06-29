Prompt for a High-Quality Coach Schedule Management Calendar UI (Frontend with Dummy Data)
Objective: Design a visually stunning, intuitive, and feature-rich web-based calendar UI for coaches to manage their availability, view bookings, and set up recurring/one-off schedules. The design should prioritize user experience, responsiveness, and clear information hierarchy. Assume an authenticated coach is viewing their personal schedule.
Key Design Principles:
Clarity & Readability: Easy to digest information at a glance.
Intuitive Interaction: Minimal clicks for common tasks.
Visual Hierarchy: Important information stands out.
Responsiveness: Flawless experience across desktop, tablet, and mobile.
Aesthetics: Modern, clean, and professional design language with a subtle color palette that enhances usability.
I. Overall Layout & Navigation:
Header:
Left: "Coach Dashboard" / "My Schedule" title.
Center: Current Month/Year displayed prominently (e.g., "October 2023").
Right:
Navigation arrows (<, >) to move between weeks/months.
"Today" button to jump back to the current date.
View Selector: Toggle between "Day," "Week," "Month" (with the current view highlighted).
"Add Availability" / "Block Time" button (prominent CTA).
Sidebar (Collapsible/Optional for Desktop):
Coach's Profile Summary (name, photo, quick stats).
"Upcoming Bookings" list (briefly showing next 3-5 sessions, clickable for details).
"Availability Templates" (e.g., "Weekday Morning Slots", "Weekend Full Day").
Settings/Help links.
Main Content Area: The calendar grid itself, dynamically adjusting based on the selected view.
II. Calendar Views & Interaction:
A. Monthly View (Default/Overview):
Grid Layout: Standard 7-day week columns, rows for each week.
Date Cells: Each day cell clearly shows the date.
Visual Indicators:
Available Slots: A subtle dot or number indicating the number of available slots for that day.
Booked Sessions: Small, color-coded blocks or badges representing booked sessions.
Color Legend:
Green: Confirmed Booking
Blue: Pending Confirmation (if applicable)
Orange: Rescheduled
Red: Cancelled
Blocked Time: A grayed-out or striped overlay on days with no availability.
Current Day: Clearly highlighted (e.g., distinct border, background color).
Hover State: Hovering over a day cell reveals a quick summary (e.g., "3 Booked Sessions, 5 Available Slots").
Click Action: Clicking a day cell transitions to the "Day View" for that specific date.
B. Weekly View (Detailed Planning):
Layout:
Leftmost Column: Time slots (e.g., 8:00 AM, 9:00 AM, ... 8:00 PM).
Top Row: Day of the week and date (e.g., "Mon 23", "Tue 24").
Time Slots: Each hour/half-hour slot is visually distinct.
Availability Blocks:
Coach-defined availability is shown as transparent, light-colored blocks (e.g., light green).
These blocks should be draggable/resizable to easily adjust availability.
Booked Sessions (within availability):
Clearly defined blocks within the availability.
Each block shows:
Student Name (clickable to student profile/booking details).
Session Type (e.g., "30 min Online").
Status icon (e.g., a green check for confirmed).
Time duration.
Hovering over a booked session reveals more details (popup).
Clicking opens a modal with full booking details and options.
Blocked Time: Opaque, darker gray blocks covering times the coach is unavailable (e.g., personal appointments, lunch breaks). These should also be editable.
"Add Availability" / "Block Time" Interaction:
Click-and-drag on an empty time slot within the calendar creates a new availability/blocked time entry.
A small modal appears to confirm details (recurring/one-off, duration, type).
C. Daily View (Granular Control):
Layout: Similar to Weekly View but focused on a single day.
Timeline: Vertical timeline of the selected day.
All elements from Weekly View apply: Availability blocks, booked sessions, blocked times.
Drag-and-Drop: Ability to drag a booked session to a different available slot (initiates a reschedule confirmation process).
"Quick Add" button: A floating action button (FAB) or prominent button to quickly add a new availability block or block out time for that day.
III. Modals & Popups (Interactive Elements):
A. "Add/Edit Availability" Modal:
Fields:
Start Date, End Date (optional, for recurring schedules).
Start Time, End Time.
Days of Week Selector (for recurring).
Availability Type: "Available" vs. "Blocked Time" (radio buttons/toggle).
Session Duration (e.g., 30 min, 60 min, custom – dropdown).
Buffer Time (pre/post session, e.g., 10 min – dropdown).
Notes (optional).
Recurrence Options: "Does this repeat?" (Yes/No toggle)
If Yes: "Daily," "Weekly," "Custom" (e.g., every 2 weeks on Mon, Wed).
"Ends on" (date picker) / "Never" / "After X occurrences."
Conflict Detection: Proactive warning if adding new availability conflicts with existing bookings or blocked times.
Call to Action: "Save Availability," "Cancel."
B. "Booking Details" Modal (when clicking a booked session):
Header: "Session with [Student Name]" (e.g., "Session with Jane Doe").
Details Display:
Date & Time (with user's local timezone displayed).
Session Type (e.g., "60 min Online Coaching").
Student Contact Info (email, phone - obfuscated until needed).
Status (e.g., "Confirmed," "Pending").
Payment Status (e.g., "Paid," "Pending Payment").
Link to Live Session (for online sessions - e.g., "Join Session Now" button, active 5 mins before start).
Actions:
"Reschedule Session" (opens a mini-calendar to pick a new slot).
"Cancel Session" (with confirmation dialog and cancellation policy reminder).
"Send Message to Student."
"Add Session Notes" (text area).
"Mark as Completed" (after session).
C. "Block Time" Modal:
Fields: Start Date, End Date, Start Time, End Time, Reason (e.g., "Personal Appointment," "Holiday," "Admin Time").
Recurrence: Similar to availability, for recurring blocks.
Call to Action: "Block Time," "Cancel."
IV. Dummy Data Representation:
The UI should be populated with realistic dummy data for at least two weeks:
Coach Availability:
Recurring slots: Mon-Fri, 9 AM - 1 PM.
Recurring slots: Tue & Thu, 3 PM - 5 PM.
One-off availability: Next Saturday, 10 AM - 12 PM.
Blocked Times:
Recurring: Daily 1 PM - 2 PM (Lunch).
One-off: Next Wednesday, 10 AM - 11 AM (Personal appointment).
Full day blocked: Day after next Friday (Holiday).
Booked Sessions (mix of statuses):
Confirmed: Several sessions spread across available slots, with different students and session types.
Pending Confirmation: One or two sessions (if applicable to the workflow).
Rescheduled: One session that was originally earlier but moved.
Cancelled: One session, clearly marked as such.
Upcoming: At least 3-5 sessions in the "Upcoming Bookings" sidebar.
Completed: A couple of sessions from previous days.
Student Names: Realistic but dummy names (e.g., "Alice Johnson," "Bob Smith," "Carol White").
Session Types: "30 min Online Consultation," "60 min In-person Coaching," "45 min Follow-up Call."
V. Responsiveness & Accessibility:
The design should gracefully adapt to smaller screens (tablet, mobile), possibly simplifying the layout (e.g., stacked view for daily slots, swipe gestures for navigation, collapsible sidebar).
Consider basic accessibility features (e.g., keyboard navigation for calendar elements, clear focus states, ARIA labels).
VI. Visuals & Microinteractions:
Loading States: Subtle loaders or skeleton screens when data is being fetched.
Success/Error Messages: Clear, unobtrusive toasts or alerts for actions (e.g., "Availability Saved," "Booking Confirmed," "Error: Slot Already Taken").
Animations: Smooth transitions when changing views or opening modals.
Color Palette: Professional and calming, using color effectively to denote status without being overwhelming.
Typography: Readable fonts with good line height and contrast.
Iconography: Modern and consistent icon set.
Deliverable: A high-fidelity UI design (e.g., Figma, Sketch, Adobe XD mockup) or a detailed textual description accompanied by relevant UI elements.
This prompt aims to solicit a truly comprehensive and perfectly executed calendar UI for coach schedule management, covering all necessary features and considerations for a superior user experience.