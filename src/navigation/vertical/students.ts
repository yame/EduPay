export default [
  {
    heading: 'Student Management', action: 'manage',
    subject: 'ADMIN'
  },

  {
    title: 'Students',
    to: { name: 'student' },
    icon: { icon: 'tabler-school' },
    children: [{
      title: 'List',
      to: { name: 'admin-student-list' },
      icon: { icon: 'tabler-users' },
      action: 'manage',
      subject: 'ADMIN'
    },
    {
      title: 'Add',
      to: { name: 'admin-student-add' },
      icon: { icon: 'tabler-user-plus' },
      action: 'manage',
      subject: 'ADMIN'
    }]
  }
]
