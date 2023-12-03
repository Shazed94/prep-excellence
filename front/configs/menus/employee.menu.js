export default [
  {
    icon: 'mdi-school-outline', key: 'menu.studentTask', text: 'Student Task', regex: /^\/studentTask/,
    items: [
      { icon: 'mdi-file-sign', key: 'menu.homeWork', text: 'Home Works', link: '#',  exact: true, action: 'read', subject: 'Employee' },
      { icon: 'mdi-text-box-check-outline', key: 'menu.courseMaterials', text: 'Course Materials', link: '#',  exact: true, action: 'read', subject: 'Employee' },
      { icon: 'mdi-text-box-search-outline', key: 'menu.attendance', text: 'Attendance', link: '#',  exact: true, action: 'read', subject: 'Employee' },
      { icon: 'mdi-table-arrow-up', key: 'menu.markUpload', text: 'Mark Upload', link: '#',  exact: true, action: 'read', subject: 'Employee' },
    ]
  },
  {
    icon: 'mdi-bank', key: 'menu.personal', text: 'Personal', regex: /^\/personal/,
    items: [
      { icon: 'mdi-cash-multiple', key: 'menu.salary', text: 'Salary', link: '#',  exact: true, action: 'read', subject: 'Employee' },
      { icon: 'mdi-file-sign', key: 'menu.attendance', text: 'Attendance', link: '#',  exact: true, action: 'read', subject: 'Employee' },
      { icon: 'mdi-text-box-minus-outline', key: 'menu.leaveRequest', text: 'Leave Request', link: '#',  exact: true, action: 'read', subject: 'Employee' },
    ]
  },
]
