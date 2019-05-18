import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Home from '@screens/Home'
import SqlScreen from '@screens/Sql'
import Suppliers from '@screens/Suppliers'
import SuppliersImport from '@screens/Suppliers/Import'
import SuppliersView from '@screens/Suppliers/View'

import Deliveries from '@screens/Deliveries'
import BadOrders from '@screens/BadOrders'
import { NotFound } from '@screens/ErrorPages'

type Props = {
  children: Object
}

const Routes = ({ children }: Props) => {
  return (
    <Router>
      {children}
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/sql" component={SqlScreen} />
        <Route path="/suppliers" exact component={Suppliers} />
        <Route path="/suppliers/import" exact component={SuppliersImport} />
        <Route path="/suppliers/:id" component={SuppliersView} />
        <Route path="/deliveries" component={Deliveries} />
        <Route path="/bad-orders" component={BadOrders} />

        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes
