import React, { useState } from 'react'
// import moment from 'moment'
// import numeral from 'numeral'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  Page,
  PageSection,
  Title
} from '@lib/Page'


import Container from '@lib/Container'
import SearchBar from '@shared/SearchBar'
// import Paginator from '@lib/Paginator'
// import Loader from '@shared/Loader'

import './style.scss'

const BadOrders = () => {
  // const limit = 20
  // const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const searchChange = (e) => {
    // setPage(1)
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

        </PageSection>

        <PageSection>
          Content for Bad Orders
        </PageSection>
      </Container>
    </Page>
  )
}

export default BadOrders
