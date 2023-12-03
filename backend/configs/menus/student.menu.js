export default [
  { icon: 'mdi-counter', key: 'menu.myCourse', text: 'My Course', link: '/student/course',  exact: true, action: 'read', subject: 'Student' },
 /* {
    icon: 'mdi-calendar-month-outline', key: 'menu.myRoutine', text: 'My Routines', regex: /^\/studentRoutine/,
    items: [
      { icon: 'mdi-calendar-text-outline', key: 'menu.classRoutine', text: 'Class Routine', link: '#',  exact: true, action: 'read', subject: 'Student' },
      { icon: 'mdi-calendar-edit', key: 'menu.examRoutine', text: 'Exam Routine', link: '#',  exact: true, action: 'read', subject: 'Student' },
    ]
  },*/
  { icon: 'mdi-calendar-month-outline', key: 'menu.mySchedule', text: 'My Schedule', link: '/student/schedule',  exact: true, action: 'read', subject: 'Student' },
  {
    icon: 'mdi-calendar-check-outline', key: 'menu.myTask', text: 'My Task', regex: /^\/studentTask/,
    items: [
      { icon: 'mdi-checkbox-marked-circle-plus-outline', key: 'menu.homeWork', text: 'Home Works', link: '/student/homeWork',  exact: true, action: 'read', subject: 'Student' },
      { icon: 'mdi-calendar-check', key: 'menu.courseMaterials', text: 'Course Materials', link: '/student/courseMaterial',  exact: true, action: 'read', subject: 'Student' },
    ]
  },
  /*{
    icon: 'mdi-calendar-search', key: 'menu.myAttendance', text: 'My Attendance', regex: /^\/personal/,
    items: [
      { icon: 'mdi-calendar-search', key: 'menu.attendance', text: 'Attendance', link: '#',  exact: true, action: 'read', subject: 'Student' },
      { icon: 'mdi-calendar-clock-outline', key: 'menu.leaveRequest', text: 'Leave Request', link: '#',  exact: true, action: 'read', subject: 'Student' },
    ]
  },*/
  { icon: 'mdi-calendar-search', key: 'menu.attendance', text: 'Attendance', link: '/student/attendance',  exact: true, action: 'read', subject: 'Student' },
  { icon: 'mdi-resistor', key: 'menu.myExams', text: 'My Exams', link: '#',  exact: true, action: 'read', subject: 'Student' },
  { icon: 'mdi-resistor', key: 'menu.myResult', text: 'My Results', link: '#',  exact: true, action: 'read', subject: 'Student' },
  {
    icon: 'mdi-credit-card-settings-outline', key: 'menu.myPayments', text: 'My Payments', regex: /^\/personal/,
    items: [
      { icon: 'mdi-credit-card-outline', key: 'menu.payment', text: 'Payment', link: '#',  exact: true, action: 'read', subject: 'Student' },
      { icon: 'mdi-credit-card-marker-outline', key: 'menu.paymentHistory', text: 'Payment history', link: '#',  exact: true, action: 'read', subject: 'Student' },
    ]
  },
]
