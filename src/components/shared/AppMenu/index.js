import React from 'react'
import Menu from 'lib/Menu'

const links = [
  {
    text: 'Home',
    url: '/'
  },
  {
    text: 'Docs',
    url: '/menu/2'
  },
  {
    text: 'Test',
    url: '/menu/3'
  }
]

const AppMenu = () => {
  return (
    <Menu links={links} />
  )
}

export default AppMenu
