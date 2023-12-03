export default [
  {
    icon: 'mdi-school-outline', key: 'menu.studentTask', text: 'Student Task', regex: /^\/studentTask/,
    items: [
      { icon: 'mdi-file-sign', key: 'menu.mySchedule', text: 'My Schedule', link: '/employee/schedule',  exact: true, action: 'read', subject: 'Employee Schedule' },
      { icon: 'mdi-file-sign', key: 'menu.course', text: 'Course', link: '/employee/course',  exact: true, action: 'read', subject: 'Employee Courses' },
      { icon: 'mdi-file-sign', key: 'menu.homeWork', text: 'Home Works', link: '/employee/homeWork',  exact: true, action: 'read', subject: 'Employee Homework' },
      { icon: 'mdi-text-box-check-outline', key: 'menu.courseMaterials', text: 'Course Materials', link: '/employee/courseMaterial',  exact: true, action: 'read', subject: 'Employee Course Material' },
      { icon: 'mdi-text-box-search-outline', key: 'menu.attendance', text: 'Attendance', link: '/employee/attendance',  exact: true, action: 'read', subject: 'Employee Attendance' },
      { icon: 'mdi-language-xaml', key: 'menu.satScore', text: 'Sat Score', link: '/employee/score',  exact: true, action: 'read', subject: 'Sat Raw Score' },
      { icon: 'mdi-language-xaml', key: 'menu.exam', text: 'Exam', link: '/employee/exam',  exact: true, action: 'read', subject: 'Employee Test' },
      { icon: 'mdi-language-xaml', key: 'menu.examResults', text: 'Exam Results', link: '/employee/result',  exact: true, action: 'read', subject: 'Employee Test Result' },
      //{ icon: 'mdi-table-arrow-up', key: 'menu.markUpload', text: 'Mark Upload', link: '#',  exact: true, action: 'read', subject: 'Employee' },
    ]
  },
  /*{
    icon: 'mdi-bank', key: 'menu.personal', text: 'Personal', regex: /^\/personal/,
    items: [
      { icon: 'mdi-cash-multiple', key: 'menu.salary', text: 'Salary', link: '#',  exact: true, action: 'read', subject: 'Employee' },
      { icon: 'mdi-file-sign', key: 'menu.attendance', text: 'Attendance', link: '#',  exact: true, action: 'read', subject: 'Employee' },
      { icon: 'mdi-text-box-minus-outline', key: 'menu.leaveRequest', text: 'Leave Request', link: '#',  exact: true, action: 'read', subject: 'Employee' },
    ]
  },*/
]
