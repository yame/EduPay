export default [
  {
    heading: 'Admin Management',
    action: 'manage',
    subject: 'ADMIN'
  },

  {
    title: 'Admins',
    to: { name: 'admin' },
    icon: { icon: 'tabler-user-star' },
    action: 'manage',
    subject: 'ADMIN',
    children: [{
      title: 'List',
      to: { name: 'admin-admin-list' },
      icon: { icon: 'tabler-password-user' },
      action: 'manage',
      subject: 'ADMIN'
    },
    {
      title: 'Add',
      to: { name: 'admin-admin-add' },
      icon: { icon: 'tabler-user-plus' },
      action: 'manage',
      subject: 'ADMIN'
    }
    ]
  }
]
