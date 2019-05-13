import React from 'react'
import classNames from 'classnames'
import {
  Link,
  withRouter
} from 'react-router-dom'
import './style.scss'

type MenuProps = {
  location: Object,
  links: Array<{
    text: string,
    url: string
  }>
}

const Menu = ({ links }: MenuProps) => (
  <div className="menu">
    <ul>
      {
        links.map(({ text, url }) => (
          <li key={`key-menu-${url}`}>
            <Link
              to={url}
              className={classNames('menu-link', {
                active: url == location.pathname
              })}
            >
              {text}
            </Link>
          </li>
        ))
      }
    </ul>
  </div>
)

export default withRouter(Menu)
