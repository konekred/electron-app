import React from 'react'
import { Link } from 'react-router-dom'
import Container from 'lib/Container'
import {
  Page,
  PageSection,
  Title
} from 'lib/Page'

// import { Query } from 'react-apollo'
// import SuppliersQuery from '../../../graphql/queries/suppliers.gql'

import SearchBar from 'shared/SearchBar'
import './style.scss'

const Suppliers = () => (
  <Page>
    <Container>
      <PageSection>
        <Title text="Suppliers" />
      </PageSection>

      <PageSection>
        <SearchBar />
      </PageSection>

      <PageSection>
        <Link to="/suppliers/import">Import Supplier</Link>
      </PageSection>

      <PageSection>

      </PageSection>
    </Container>
  </Page>
)

export default Suppliers
