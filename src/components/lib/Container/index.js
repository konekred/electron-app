import React from 'react'
import './style.scss'

type Props = {
  children: Object
}

const Container = ({ children }: Props ) => (
  <div className="container">
    {children}
  </div>
)

export default Container
