export default [
  {
    heading: 'Payment Management', action: 'manage',
    subject: 'ADMIN'
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
      subject: 'ADMIN'
    }]
  }
]
