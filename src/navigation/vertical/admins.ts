export default [
  { heading: 'Admin Management' },

  {
    title: 'Admins',
    to: { name: 'admin' },
    icon: { icon: 'tabler-user-star' },
    action: 'manage',
    subject: 'all',
    children: [{
      title: 'List',
      to: { name: 'admin-admin-list' },
      icon: { icon: 'tabler-password-user' },
      action: 'manage',
      subject: 'all'
    },
    {
      title: 'Add',
      to: { name: 'admin-admin-add' },
      icon: { icon: 'tabler-user-plus' },
      action: 'manage',
      subject: 'all'
    }
    ]
  }
]
