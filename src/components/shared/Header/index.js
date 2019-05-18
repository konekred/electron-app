import React from 'react'
import Container from '@lib/Container'
import AppMenu from '@shared/AppMenu'
import './style.scss'

const Header = () => (
  <div className="header">
    <Container>
      <AppMenu />
    </Container>
  </div>
)

export default Header
