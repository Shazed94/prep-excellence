export default [
  {
    icon: 'mdi-post', key: 'menu.blogs', text: 'Blogs', regex: /^\/blogs/,
    items: [
      { icon: 'mdi-format-list-bulleted', key: 'menu.list', text: 'List', link: '/public/blog/post',  exact: true, action: 'read', subject: 'Admin' },
      { icon: 'mdi-format-list-text', key: 'menu.categories', text: 'Categories', link: '/public/blog/category',  exact: true, action: 'read', subject: 'Admin' },
    ]
  },
  {
    icon: 'mdi-home', key: 'menu.homePage', text: 'Blogs', regex: /^\/homePage/,
    items: [
      { icon: 'mdi-play-box-outline', key: 'menu.slider', text: 'Slider', link: '/public/homePage/slider',  exact: true, action: 'read', subject: 'Admin' },
      { icon: 'mdi-home-switch', key: 'menu.homeSection', text: 'Home Section', link: '/public/homePage/homeSection',  exact: true, action: 'read', subject: 'Admin' },
    ]
  },
  {
    icon: 'mdi-view-gallery-outline', key: 'menu.gallery', text: 'Gallery', regex: /^\/gallery/,
    items: [
      { icon: 'mdi-view-gallery', key: 'menu.gallery', text: 'Gallery', link: '#',  exact: true, action: 'read', subject: 'Admin' },
      { icon: 'mdi-calendar-text-outline', key: 'menu.categories', text: 'Category', link: '/public/gallery/category',  exact: true, action: 'read', subject: 'Admin' },
    ]
  },
  {
    icon: 'mdi-cog-outline', key: 'menu.settings', text: 'Settings', regex: /^\/settings/,
    items: [
      {
        icon: 'mdi-currency-bdt', key: 'menu.generalSettings', text: 'General Settings', regex: /^\/generalSettings/,
        items:[
          { icon: 'mdi-cogs', key: 'menu.webInfo', text: 'Web Info', link: '/public/settings/generalSettings/webInfo',  exact: true, action: 'read', subject: 'Admin' },
          { icon: 'mdi-eslint', key: 'menu.logoFavicons', text: 'Logo & Favicons', link: '/public/settings/generalSettings/logoFav',  exact: true, action: 'read', subject: 'Admin' },
          { icon: 'mdi-social-distance-6-feet', key: 'menu.socialLinks', text: 'Social Links', link: '/public/settings/generalSettings/socialLinks',  exact: true, action: 'read', subject: 'Admin' },
        ]
      },

      { icon: 'mdi-page-layout-body', key: 'menu.pages', text: 'Pages', link: '/public/settings/page',  exact: true, action: 'read', subject: 'Admin' },
      { icon: 'mdi-menu', key: 'menu.menus', text: 'Menus', link: '/public/settings/menu',  exact: true, action: 'read', subject: 'Admin' },
      //{ icon: 'mdi-currency-bdt', key: 'menu.media', text: 'Media', link: '#',  exact: true, action: 'read', subject: 'Admin' },
      { icon: 'mdi-page-layout-footer', key: 'menu.footerWidgets', text: 'Footer Widgets', link: '/public/settings/widget',  exact: true, action: 'read', subject: 'Admin' },
    ]
  },
  {
    icon: 'mdi-frequently-asked-questions', key: 'menu.faqs', text: 'Faqs', link: '/public/faq',  exact: true, action: 'read', subject: 'Admin' ,
  },
  {
    icon: 'mdi-book-open-blank-variant', key: 'menu.contactFormRequest', text: 'Contact Form Request', link: '/public/contact_request',  exact: true, action: 'read', subject: 'Admin' ,
  },
]
