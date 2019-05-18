import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Container from '@lib/Container'
import {
  Page,
  PageSection,
  Title
} from '@lib/Page'

import Paginator from '@lib/Paginator'
import SearchBar from '@shared/SearchBar'
import Loader from '@shared/Loader'
import SuppliersQuery from '@graphql/queries/suppliers.gql'

import './style.scss'

const Suppliers = () => {
  const limit = 50
  const [page, setPage] = useState(1)

  return (
    <Page>
      <Container>
        <PageSection>
          <Title text="Suppliers" />

          <div className="action-bar">
            <div className="actions two search-action">
              <SearchBar />
            </div>

            <div className="actions two link-action">
              <Link to="/suppliers/import">
                <FontAwesomeIcon className="action-icon" icon="upload"/>
                <span>Import</span>
              </Link>
            </div>
          </div>

          <Query query={SuppliersQuery} variables={{ limit, page }} fetchPolicy="network-only">
            {({ data, loading, error }) => {
              if (loading || error) {
                return <Loader />
              }

              const { suppliers } = data
              const { pagination } = suppliers

              return (
                <Fragment>
                  <table className="suppliers-table">
                    <thead>
                      <tr>
                        <th className="number">#</th>
                        <th className="code">Code</th>
                        <th className="name">Name</th>
                        <th className="email">Email</th>
                        <th className="representative">Representative</th>
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
                          <td>{supplier.email}</td>
                          <td>{supplier.representative}</td>
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
