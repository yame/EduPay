export default [
  {
    heading: 'Payment Management', action: 'manage',
    subject: 'all'
  },

  {
    title: 'Payments',
    to: { name: 'payment' },
    icon: { icon: 'tabler-brand-cashapp' },
    children: [{
      title: 'List',
      to: { name: 'admin-payment-list' },
      icon: { icon: 'tabler-files' },
      action: 'manage',
      subject: 'all'
    }]
  }
]
