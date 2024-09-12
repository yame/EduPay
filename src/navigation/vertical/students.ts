export default [
  { heading: 'Student Management' },

  {
    title: 'Students',
    to: { name: 'student' },
    icon: { icon: 'tabler-smart-home' },
    children: [{
      title: 'List',
      to: { name: 'student-list' },
      icon: { icon: 'tabler-users' },
    },
    {
      title: 'Add',
      to: { name: 'student-add' },
      icon: { icon: 'tabler-user-plus' },
    }]
  }
]
