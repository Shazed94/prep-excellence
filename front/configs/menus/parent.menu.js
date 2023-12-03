export default [
  { icon: 'mdi-human-male-female-child', key: 'menu.children', text: 'Children', link: '#',  exact: true, action: 'read', subject: 'Parent' },
  { icon: 'mdi-counter', key: 'menu.childrenCourse', text: 'Children Course', link: '#',  exact: true, action: 'read', subject: 'Parent' },
  {
    icon: 'mdi-calendar-month-outline', key: 'menu.childrenRoutine', text: 'Children Routines', regex: /^\/childrenRoutine/,
    items: [
      { icon: 'mdi-calendar-text-outline', key: 'menu.classRoutine', text: 'Class Routine', link: '#',  exact: true, action: 'read', subject: 'Parent' },
      { icon: 'mdi-calendar-edit', key: 'menu.examRoutine', text: 'Exam Routine', link: '#',  exact: true, action: 'read', subject: 'Parent' },
    ]
  },
  {
    icon: 'mdi-calendar-check-outline', key: 'menu.childrenTask', text: 'Children Task', regex: /^\/childrenTask/,
    items: [
      { icon: 'mdi-checkbox-marked-circle-plus-outline', key: 'menu.homeWork', text: 'Home Works', link: '#',  exact: true, action: 'read', subject: 'Parent' },
      { icon: 'mdi-calendar-check', key: 'menu.courseMaterials', text: 'Course Materials', link: '#',  exact: true, action: 'read', subject: 'Parent' },
    ]
  },
  { icon: 'mdi-calendar-search', key: 'menu.childrenAttendance', text: 'Children Attendance', link: '#',  exact: true, action: 'read', subject: 'Parent' },
  { icon: 'mdi-resistor', key: 'menu.childrenResult', text: 'Children Results', link: '#',  exact: true, action: 'read', subject: 'Parent' },
  {
    icon: 'mdi-credit-card-settings-outline', key: 'menu.childrenPayments', text: 'Children Payments', regex: /^\/childrenPayments/,
    items: [
      { icon: 'mdi-credit-card-outline', key: 'menu.payment', text: 'Payment', link: '#',  exact: true, action: 'read', subject: 'Parent' },
      { icon: 'mdi-credit-card-marker-outline', key: 'menu.paymentHistory', text: 'Payment history', link: '#',  exact: true, action: 'read', subject: 'Parent' },
    ]
  },
]
