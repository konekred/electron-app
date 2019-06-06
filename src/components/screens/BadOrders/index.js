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
import BadOrdersQuery from '@graphql/queries/bad-orders.gql'

import Loader from '@lib/Loader'
import ErrorBlock from '@lib/ErrorBlock'

import './style.scss'

const BadOrders = () => {
  const limit = 100
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
          <Title text="Bad Orders" />

          <div className="action-bar">
            <div className="actions two search-action">
              <SearchBar
                value={search}
                onChange={searchChange}
              />
            </div>

            <div className="actions two link-action">
              <Link to="/bad-orders/import">
                <FontAwesomeIcon className="action-icon" icon="upload" />
                <span>Import</span>
              </Link>
            </div>
          </div>

          <Query fetchPolicy="network-only" query={BadOrdersQuery} variables={{ limit, page, search }}>
            {({ data, loading, error }) => {
              if (error) {
                return <ErrorBlock error={error} />
              }

              if (loading) {
                return <Loader />
              }

              const { badOrders } = data
              const { pagination } = badOrders

              return (
                <Fragment>
                  <table className="bad-orders-table">
                    <thead>
                      <tr>
                        <th className="counter">#</th>
                        <th className="invoice-number">Transaction Number</th>
                        <th className="supplier">Supplier</th>
                        <th className="quantity ">Quantity</th>
                        <th className="amount">Amount</th>
                        <th className="date">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {badOrders.data.map((badOrder, index) => (
                        <tr key={`delivery-${badOrder.id}`}>
                          <th>
                            {((page - 1) * limit) + (index + 1)}
                          </th>

                          <td className="invoice-number">
                            <Link to={`/bad-orders/${badOrder.id}`}>
                              {numeral(badOrder.transactionNumber).format('0000000000')}
                            </Link>
                          </td>

                          <td className="supplier">
                            {badOrder.supplier.name}
                          </td>

                          <td className="quantity">
                            {badOrder.quantity}
                          </td>

                          <td className="amount">
                            {numeral(badOrder.amount).format('0,0.00')}
                          </td>

                          <td className="date">
                            {moment(badOrder.date).format('MMM. DD YYYY')}
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

export default BadOrders
