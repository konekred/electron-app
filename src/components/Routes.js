import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Home from 'screens/Home'
import { NotFound } from 'screens/ErrorPages'

const Menu = () => (
  <h1>Menu</h1>
)

type Props = {
  children: Object
}

const Routes = ({ children }: Props) => {
  return (
    <Router>
      {children}
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/menu/:id" component={Menu} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes
