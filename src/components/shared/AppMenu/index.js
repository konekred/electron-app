import React from 'react'
import Menu from '@lib/Menu'

const links = [
  {
    text: 'Home',
    url: '/'
  },
  {
    text: 'Suppliers',
    url: '/suppliers'
  },
  {
    text: 'Deliveries',
    url: '/deliveries'
  },
  {
    text: 'Bad Orders',
    url: '/bad-orders'
  }
]

const AppMenu = () => (
  <Menu links={links} />
)

export default AppMenu
