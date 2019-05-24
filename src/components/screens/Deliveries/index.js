import React, { Fragment, useState } from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  Page,
  Title,
  PageSection
} from '@lib/Page'

import Container from '@lib/Container'
import SearchBar from '@shared/SearchBar'
import Paginator from '@lib/Paginator'
import Loader from '@shared/Loader'
import DeliveriesQuery from '@graphql/queries/deliveries.gql'

import './style.scss'

const Deliveries = () => {
  const limit = 20
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const searchChange = (e) => {
    setPage(1)
    setSearch(e.target.value)
  }

  return (
    <Page>
      <Container>
        <PageSection>
          <Title text="Deliveries" />

          <div className="action-bar">
            <div className="actions two search-action">
              <SearchBar
                value={search}
                onChange={searchChange}
              />
            </div>

            <div className="actions two link-action">
              <Link to="/deliveries/import">
                <FontAwesomeIcon className="action-icon" icon="upload" />
                <span>Import</span>
              </Link>
            </div>
          </div>

          <Query fetchPolicy="network-only" query={DeliveriesQuery} variables={{ limit, page, search }}>
            {({ data }) => {
              if (!data.deliveries) {
                return <Loader />
              }

              const { deliveries } = data
              const { pagination } = deliveries

              return (
                <Fragment>
                  <table className="deliveries-table">
                    <thead>
                      <tr>
                        <th className="counter">#</th>
                        <th className="invoice-number">Invoice Number</th>
                        <th className="supplier">Supplier</th>
                        <th className="quantity ">Quantity</th>
                        <th className="amount">Amount</th>
                        <th className="date">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.data.map((delivery, index) => (
                        <tr key={`delivery-${delivery.purchaseOrderNumber}`}>
                          <th>
                            {((page - 1) * limit) + (index + 1)}
                          </th>

                          <td className="invoice-number">
                            <Link to={`/deliveries/${delivery.purchaseOrderNumber}`}>
                              {delivery.purchaseOrderNumber}
                            </Link>
                          </td>

                          <td className="supplier">
                            {delivery.supplier.name}
                          </td>

                          <td className="quantity">
                            {delivery.quantity}
                          </td>

                          <td className="amount">
                            {numeral(delivery.amount).format('0,0.00')}
                          </td>

                          <td className="date">
                            {moment(delivery.date).format('MMM. DD YYYY')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Paginator
                    pages={pagination.pages}
                    current={page}
                    limit={10}
                    pageClick={setPage}
                  />
                </Fragment>
              )
            }}
          </Query>
        </PageSection>

      </Container>
    </Page>
  )
}

export default Deliveries
