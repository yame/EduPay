export default [
  { heading: 'Student Management' },

  {
    title: 'Students',
    to: { name: 'student' },
    icon: { icon: 'tabler-school' },
    children: [{
      title: 'List',
      to: { name: 'admin-student-list' },
      icon: { icon: 'tabler-users' },
    },
    {
      title: 'Add',
      to: { name: 'admin-student-add' },
      icon: { icon: 'tabler-user-plus' },
    }]
  }
]
