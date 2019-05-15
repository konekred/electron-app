import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Home from 'screens/Home'
import Suppliers from 'screens/Suppliers'
import SuppliersImport from 'screens/Suppliers/Import'
import Deliveries from 'screens/Deliveries'
import BadOrders from 'screens/BadOrders'
import { NotFound } from 'screens/ErrorPages'

type Props = {
  children: Object
}

const Routes = ({ children }: Props) => {
  return (
    <Router>
      {children}
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/suppliers" exact component={Suppliers} />
        <Route path="/suppliers/import" component={SuppliersImport} />
        <Route path="/deliveries" component={Deliveries} />
        <Route path="/bad-orders" component={BadOrders} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes
