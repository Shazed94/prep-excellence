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
          icon: 'mdi-book-open-outline', key: 'menu.tutorialAdmin', text: 'Tutorials', regex: /^\/tutorials/,
          items: [
            {icon: 'mdi-bookshelf', key: 'menu.category', text: 'Category', link: '/admin/tutorial/category', action: 'read', subject: 'Tutorial Category'},
            {icon: 'mdi-bookshelf', key: 'menu.tutorial', text: 'Tutorial', link: '/admin/tutorial', action: 'read', subject: 'Tutorial'},
          ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {icon: 'mdi-view-dashboard-outline', key: 'menu.tutorial',
          action: 'read', subject: 'Auth',
          text: 'Tutorial', link: '/tutorial'
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
            {icon: 'mdi-skull-crossbones', key: 'menu.rolePermission', text: 'Role Permission', link: '/rolePermission/rolePermission', action: 'read', subject: 'Role Permission'},
            {icon: 'mdi-account-key-outline', key: 'menu.userPermission', text: 'User Permission', link: '/rolePermission/userPermission', action: 'read', subject: 'User Permission'},
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
          //icon: 'mdi-cash-100', key: 'menu.accounts', text: 'Accounts', regex: /^\/accounts/,
          icon: 'mdi-cash-minus', key: 'menu.operatingExpenses', text: 'Operational Expense', regex: /^\/expenses/,
          items: [
            { icon: 'mdi-bank', key: 'menu.banks', text: 'Manage Banks', link: '/accounts/banks',  exact: true, action: 'read', subject: 'Bank' },
            { icon: 'mdi-account-cash', key: 'menu.bankAccounts', text: 'Manage Bank Accounts', link: '/accounts/bank-account',  exact: true, action: 'read', subject: 'Bank Account' },
            { icon: 'mdi-cash-fast', key: 'menu.payType', text: 'Manage Payment Types', link: '/accounts/payment-type',  exact: true, action: 'read', subject: 'Payment Type' },
            { icon: 'mdi-cash-multiple', key: 'menu.expenseTypes', text: 'Manage Expense Types', link: '/expenses/types', exact: true, action: 'read', subject: 'Expense Type' },
            { icon: 'mdi-cash-fast', key: 'menu.subExpenseTypes', text: 'Manage Sub Expense Types', link: '/expenses/sub-types',  exact: true, action: 'read', subject: 'Sub-expense Type' },
            { icon: 'mdi-cash-register', key: 'menu.expenses', text: 'Manage Expense', link: '/expenses',  exact: true, action: 'read', subject: 'Expense' },
          ]
        }],
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-cart-check', key: 'menu.orders', text: 'Orders', regex: /^\/orders/,
          items: [
            {icon: 'mdi-cart-outline', key: 'menu.orderAll', text: 'All', link: '/admin/order', action: 'read', subject: 'Order'},
            {icon: 'mdi-cart-check', key: 'menu.paidOrder', text: 'Paid Order', link: '/admin/order/paid', action: 'read', subject: 'Order'},
            {icon: 'mdi-cart-remove', key: 'menu.unpaidOrder', text: 'Unpaid Order', link: '/admin/order/unpaid', action: 'read', subject: 'Order'},
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
            {icon: 'mdi-format-list-bulleted', key: 'menu.list', text: 'List', link: '/admin/student/student', action: 'read', subject: 'Students'},
            {icon: 'mdi-account-multiple-plus', key: 'menu.studentCourses', text: 'Student Courses', link: '/admin/student/studentCourse', action: 'read', subject: 'Students Course'},
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
            {icon: 'mdi-bookshelf', key: 'menu.coupon', text: 'Coupon', link: '/admin/course/coupon', action: 'read', subject: 'Coupon'},
            {icon: 'mdi-bookshelf', key: 'menu.subject', text: 'Subject', link: '/admin/course/subject', action: 'read', subject: 'Subject'},
            {icon: 'mdi-bookmark-multiple-outline', key: 'menu.courseCategories', text: 'Course Categories', link: '/admin/course/category', action: 'read', subject: 'Course Category'},
            {icon: 'mdi-book-settings-outline', key: 'menu.course', text: 'Course', link: '/admin/course/course', action: 'read', subject: 'Course'},
            {icon: 'mdi-book-settings-outline', key: 'menu.schedule', text: 'Schedule', link: '/admin/course/schedule', action: 'read', subject: 'Schedule'},
            {icon: 'mdi-book-settings-outline', key: 'menu.scheduleCancelRequest', text: 'Schedule Cancel Request', link: '/admin/course/scheduleCancelRequest', action: 'read', subject: 'Schedule Cancel Request'},
          ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-human-male-female', key: 'menu.examAndResult', text: 'Test & Result', regex: /^\/examMange/,
          items: [
            {icon: 'mdi-account-multiple-plus', key: 'menu.sectionAndTestScore', text: 'Section and Test Scores', link: '/admin/exam/score', action: 'read', subject: 'Section & Test Score'},
            {icon: 'mdi-account-multiple-plus', key: 'menu.studentExams', text: 'Student Test', link: '/admin/exam', action: 'read', subject: 'Test'},
            {icon: 'mdi-account-multiple-plus', key: 'menu.examResults', text: 'Exam Results', link: '/admin/exam/result', action: 'read', subject: 'Test Result'},
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
            {icon: 'mdi-account-multiple-plus', key: 'menu.add', text: 'Add', link: '/admin/employee/add', action: 'create', subject: 'Employees'},
            {icon: 'mdi-format-list-bulleted', key: 'menu.list', text: 'List', link: '/admin/employee', action: 'read', subject: 'Employees'},
            ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-account-group-outline', key: 'menu.billing', text: 'Billing', regex: /^\/billing/,
          items: [
            {icon: 'mdi-account-multiple-plus', key: 'menu.workingHour', text: 'Working Hour', link: '/admin/billing/workingHour', action: 'read', subject: 'Working Hour'},
            {icon: 'mdi-format-list-bulleted', key: 'menu.overTime', text: 'Over Time', link: '/admin/billing/overTime', action: 'read', subject: 'Over Time'},
            {icon: 'mdi-format-list-bulleted', key: 'menu.payments', text: 'Payments', link: '/admin/billing/payment', action: 'read', subject: 'Payment'},
          ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-account-group-outline', key: 'menu.job', text: 'Job', regex: /^\/job/,
          items: [
            {icon: 'mdi-account-multiple-plus', key: 'menu.job', text: 'Job', link: '/admin/job', action: 'read', subject: 'Job'},
            {icon: 'mdi-format-list-bulleted', key: 'menu.applicant', text: 'Applicant', link: '/admin/job/applicant', action: 'read', subject: 'Applicant'},
          ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-book-open-blank-variant', key: 'menu.tutoringRequest', text: 'Tutoring Request', link: '/admin/tutoring_request',  exact: true, action: 'read', subject: 'Tutoring Request' ,
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-book-open-blank-variant',
          key: 'menu.message', text: 'Message',
          link: '/message',  exact: true,
          action: 'read', subject: 'Message' ,
          badge: true,
          content: 'total_message',
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-account-group-outline', key: 'menu.notifications', text: 'Notification', regex: /^\/notification/,
          items: [
            {icon: 'mdi-account-multiple-plus', key: 'menu.emailNotification', text: 'Email Notification', link: '/admin/notification/emailNotification', action: 'read', subject: 'Email Notification'},
            {icon: 'mdi-format-list-bulleted', key: 'menu.smsNotification', text: 'SMS Notification', link: '/admin/notification/smsNotification', action: 'read', subject: 'Sms Notification'},
            {icon: 'mdi-format-list-bulleted', key: 'menu.pushNotification', text: 'Push Notification', link: '/admin/notification/pushNotification', action: 'read', subject: 'Push Notification'},
            {icon: 'mdi-format-list-bulleted', key: 'menu.complains', text: 'Complains', link: '/admin/notification/complain', action: 'read', subject: 'Admin Complain'},
          ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-account-group-outline', key: 'menu.myBilling', text: 'My Billing', regex: /^\/myBilling/,
          items: [
            {icon: 'mdi-account-multiple-plus', key: 'menu.workingHour', text: 'Working Hour', link: '/employee/billing/workingHour', action: 'read', subject: 'My Working Hour'},
            {icon: 'mdi-format-list-bulleted', key: 'menu.overTime', text: 'Over Time', link: '/employee/billing/overTime', action: 'read', subject: 'My Over Time'},
            {icon: 'mdi-format-list-bulleted', key: 'menu.payments', text: 'Payments', link: '/employee/billing/payment', action: 'read', subject: 'My Payment'},
          ]
        },
      ]
    },
    {
      text: '',
      key: '',
      items: [
        {icon: 'mdi-alert-circle-outline', key: 'menu.complains',
          action: 'read', subject: 'Complain',
          text: 'Complains', link: '/common/complain'
        },
        // { icon: 'mdi-file-outline', key: 'menu.blank', text: 'Blank Page', link: '/blank' }
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
