import React, { Fragment, useState } from 'react'
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
  const limit = 50
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
                        <th className="date">Date</th>
                        <th className="invoice-number">Invoice Number</th>
                        <th className="supplier">Supplier</th>
                        <th className="amount">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.data.map((delivery, index) => (
                        <tr key={`delivery-${delivery.id}`}>
                          <th>{((page - 1) * limit) + (index + 1)}</th>
                          <td className="date">{delivery.date}</td>
                          <td className="invoice-number">{delivery.invoiceNumber}</td>
                          <td className="supplier">{delivery.supplier.name}</td>
                          <td className="amount">{delivery.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Paginator
                    pages={pagination.pages}
                    current={page}
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
