import menuPages from './menus/pages.menu'
import employeeMenu from "./menus/employee.menu";
import studentMenu from "./menus/student.menu";
import parentMenu from "./menus/parent.menu";
export default {
  // main navigation - side menu
  menu: [
    {
      text: '',
      key: '',
      items: [
        {icon: 'mdi-view-dashboard-outline', key: 'menu.dashboard',
          action: 'read', subject: 'Auth',
          text: 'Dashboard', link: '/dashboard'
        },
        // { icon: 'mdi-file-outline', key: 'menu.blank', text: 'Blank Page', link: '/blank' }
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-lock', key: 'menu.rolePermission', text: 'Role & Permission', regex: /^\/rolePermission/,
          items: [
            {icon: 'mdi-dots-circle', key: 'menu.basic', text: 'Basic', link: '/rolePermission/basic', action: 'read', subject: 'Admin'},
            {icon: 'mdi-skull-crossbones', key: 'menu.rolePermission', text: 'Role Permission', link: '/rolePermission/rolePermission', action: 'read', subject: 'Admin'},
            {icon: 'mdi-account-key-outline', key: 'menu.userPermission', text: 'User Permission', link: '/rolePermission/userPermission', action: 'read', subject: 'Admin'},
          ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-account', key: 'menu.user', text: 'User', regex: /^\/user/,
          items: [
            {icon: 'mdi-dots-circle', key: 'menu.basic', text: 'Basic', link: '/user/basic', action: 'read', subject: 'Admin'},
          ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-book-open-outline', key: 'menu.manageCourse', text: 'Manage Course', regex: /^\/manageCourse/,
          items: [
            {icon: 'mdi-bookshelf', key: 'menu.subject', text: 'Subject', link: '/admin/course/subject', action: 'read', subject: 'Admin'},
            {icon: 'mdi-bookmark-multiple-outline', key: 'menu.courseCategories', text: 'Course Categories', link: '/admin/course/category', action: 'read', subject: 'Admin'},
            {icon: 'mdi-book-settings-outline', key: 'menu.course', text: 'Course', link: '/admin/course/course', action: 'read', subject: 'Admin'},
          ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-human-male-female', key: 'menu.manageStudent', text: 'Manage Student', regex: /^\/manageStudent/,
          items: [
            {icon: 'mdi-format-list-bulleted', key: 'menu.list', text: 'List', link: '/admin/student/student', action: 'read', subject: 'Admin'},
            {icon: 'mdi-account-multiple-plus', key: 'menu.studentCourses', text: 'Student Courses', link: '/admin/student/studentCourse', action: 'read', subject: 'Admin'},
          ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-account-group-outline', key: 'menu.manageEmployee', text: 'Manage Employee', regex: /^\/manageEmployee/,
          items: [
            {icon: 'mdi-account-multiple-plus', key: 'menu.add', text: 'Add', link: '/admin/employee/add', action: 'read', subject: 'Admin'},
            {icon: 'mdi-format-list-bulleted', key: 'menu.list', text: 'List', link: '/admin/employee', action: 'read', subject: 'Admin'},
            ]
        },
      ]
    },
    {
      text: 'Public Site',
      key: 'menu.publicSite',
      items: menuPages
    },
    {
      text: 'Employee Panel',
      key: 'menu.employeePanel',
      items: employeeMenu
    },
    {
      text: 'Student Panel',
      key: 'menu.studentPanel',
      items: studentMenu
    },
    {
      text: 'Parent Panel',
      key: 'menu.parentPanel',
      items: parentMenu
    }
  ],

  // footer links
  // footer: [{
  //   text: 'Docs',
  //   key: 'menu.docs',
  //   href: 'https://vuetifyjs.com',
  //   target: '_blank'
  // }]
}
