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
import DeliveriesImport from '@screens/Deliveries/Import'
import DeliveriesView from '@screens/Deliveries/View'

import BadOrders from '@screens/BadOrders'
import Vouchers from '@screens/Vouchers'
import EWTScreen from '@screens/EWT'
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

        <Route path="/deliveries" exact component={Deliveries} />
        <Route path="/deliveries/import" exact component={DeliveriesImport} />
        <Route path="/deliveries/:id" component={DeliveriesView} />

        <Route path="/bad-orders" component={BadOrders} />
        <Route path="/vouchers" component={Vouchers} />
        <Route path="/ewt" component={EWTScreen} />

        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes
