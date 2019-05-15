import React from 'react'
import Container from 'lib/Container'
import {
  Page,
  Title,
  PageSection
} from 'lib/Page'

import './style.scss'

const Import = () => (
  <Page>
    <Container>
      <PageSection>
        <Title text="Import Suppliers" />
      </PageSection>

      <PageSection>
        Content for Import Suppliers
      </PageSection>
    </Container>
  </Page>
)

export default Import
