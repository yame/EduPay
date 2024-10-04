export default [
  { heading: 'Admin Management' },

  {
    title: 'Admins',
    to: { name: 'admin' },
    icon: { icon: 'tabler-user-star' },
    children: [{
      title: 'List',
      to: { name: 'admin-admin-list' },
      icon: { icon: 'tabler-password-user' },
    },
    {
      title: 'Add',
      to: { name: 'admin-admin-add' },
      icon: { icon: 'tabler-user-plus' },
    }
    ]
  }
]
