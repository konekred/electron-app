import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  Page,
  PageSection,
  Title
} from '@lib/Page'

import Container from '@lib/Container'
import SearchBar from '@shared/SearchBar'
import Paginator from '@lib/Paginator'
import Loader from '@shared/Loader'
import SuppliersQuery from '@graphql/queries/suppliers.gql'

import './style.scss'

const Suppliers = () => {
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
          <Title text="Suppliers" />

          <div className="action-bar">
            <div className="actions two search-action">
              <SearchBar
                value={search}
                onChange={searchChange}
              />
            </div>

            <div className="actions two link-action">
              <Link to="/suppliers/import">
                <FontAwesomeIcon className="action-icon" icon="upload"/>
                <span>Import</span>
              </Link>
            </div>
          </div>

          <Query fetchPolicy="network-only" query={SuppliersQuery} variables={{ limit, page, search }}>
            {({ data }) => {
              if (!data.suppliers) {
                return <Loader />
              }

              const { suppliers } = data
              const { pagination } = suppliers

              return (
                <Fragment>
                  <table className="suppliers-table">
                    <thead>
                      <tr>
                        <th className="counter">#</th>
                        <th className="code">Code</th>
                        <th className="name">Name</th>
                        <th className="email">TIN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers.data.map((supplier, index) => (
                        <tr key={`supplier-${supplier.id}`}>
                          <th>{((page-1) * limit) + (index + 1)}</th>
                          <td className="code">{supplier.code}</td>
                          <td className="name">
                            <Link to={`/suppliers/${supplier.id}`}>
                              {supplier.name}
                            </Link>
                          </td>
                          <td>{supplier.tinNumber}</td>
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

export default Suppliers
